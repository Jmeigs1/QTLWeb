const express = require('express')

const path = require('path')

const mysql = require('mysql')
const bodyParser = require('body-parser');
const cors = require('cors')
const compression = require('compression')

const axios = require('axios')

const app = express()

const esSanitize = (query) => {
  return query
    .replace(/[\*\+\-=~><\"\?^\${}\(\)\:\!\/[\]\\\s]/g, '\\$&') // replace single character special characters
    .replace(/\|\|/g, '\\||') // replace ||
    .replace(/\&\&/g, '\\&&') // replace &&
    .replace(/AND/g, '\\A\\N\\D') // replace AND
    .replace(/OR/g, '\\O\\R') // replace OR
    .replace(/NOT/g, '\\N\\O\\T'); // replace NOT
}

const connectionPool = mysql.createPool({
    connectionLimit : 10,
    host     : 'genome-mysql.soe.ucsc.edu',
    user     : 'genome',
    port     : '3306',
    database : 'hg19'
})

const esServerIP = 'http://localhost:9200'

class Database {
  constructor( pool ) {
      this.pool = pool
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
        this.pool.query( sql, args, ( err, rows, fields ) => {
              if ( err )
                  return reject( err )
              resolve( rows )
          } )
      } )
  }
}

const esQuery = (searchTerm) => {

  var reqBody = {
    "size": 10,
    "query": {
      "bool": {
        "must": [
          {
            "query_string": {
              "analyze_wildcard": true,
              "query": esSanitize(searchTerm) + "*",
              "analyzer": "lowercasespaceanalyzer",
              "fields": ["GeneSymbol", "UniprotID", "EnsID", "ProteinName", "Coordinate", "RsNum"]
            }
          },
          {
            "bool": {
              "should": [
                {
                  "term": {
                    "Dataset": "pqtl"
                  }
                },
                {
                  "term": {
                    "Dataset": "pqtloverlap"
                  }
                },
                {
                  "bool": {
                    "must_not": {
                        "exists": {
                            "field": "Dataset"
                        }
                    }
                }
                }
              ]
            }
          }
        ]
      }
    },
    "highlight": {
      "fields": {
        "*": {}
      },
      "number_of_fragments": 1,
      "type": "plain"
    }
  }

  return axios.post(esServerIP + '/searchresults/_search', reqBody)
}

const esVarientQuery = (geneSymbol,site,chr,dataset) => {

  if(!geneSymbol || !site || !chr || !dataset){
    let resp = {
      error: "esVarientQuery() failed.  Missing argument"
    }
    return resp
  }

  var reqBody = {
    "size": 100,
    "query": {
      "bool": {
        "must": [
          {
            "term": {
              "Chr": esSanitize(chr)
            }
          },
          {
            "term": {
              "Dataset": esSanitize(dataset)
            }
          },
          {
            "term": {
              "Site": esSanitize(site)
            }
          }
        ]
      }
    }
}

  return axios.post(esServerIP + '/searchresults/_search', reqBody)
}

const esQueryRange = (rangeData) => {

  return axios.post(
          esServerIP + '/searchresults/_search',
          {
            "size": 10000,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "Chr": rangeData.chr
                            }
                        },
                        {
                          "term": {
                              "Dataset": {
                                "value": rangeData.dataset
                              }
                          }
                        },
                        {
                            "range": {
                                "Site": {
                                    "gte": rangeData.start,
                                    "lt": rangeData.end
                                }
                            }
                        }
                    ]
                }
            },
            "_source": [
                "Coordinate",
                "Site",
                "Chr",
                "NonIndexedData.GeneSymbol",
                "NonIndexedData.log10pvalue",
                "NonIndexedData.EnsemblGeneID",
                "NonIndexedData.FDR",
                "NonIndexedData.pvalue",
                "NonIndexedData.Bonferronipvalue",
                "BystroData.gnomad.genomes.id"
            ]
        })
}

const getSiteRange = (gene,pool) => {

  db = new Database(pool)

  var result = db
    .query(`
SELECT
  kg.name "knownGene.GeneName",
  kg.chrom "knownGene.chrom",
  kg.txStart "knownGene.txStart",
  kg.txEnd "knownGene.txEnd",
  kte.value "knownToEnsembl.EnsGeneID",
  kxr.mRNA "knownXref.mRNAID",
  kxr.spID "knownXref.UniProtProteinAccessionNumber",
  kxr.spDisplayID "knownXref.UniProtDisplayID",
  kxr.genesymbol "knownXref.GeneSymbol",
  kxr.refseq "knownXref.RefSeqID",
  kxr.protAcc "knownXref.NCBIProteinAccessionNumber",
  kxr.description "knownXref.Description",
  kxr.rfamAcc "knownXref.RfamAccessionNumber",
  kxr.tRnaName "knownXref.NameOfThetRNATrack",
  kc.transcript "knownCanonical.Transcript"
FROM hg19.knownGene AS kg
LEFT JOIN hg19.knownToEnsembl AS kte ON kte.name = kg.name
LEFT JOIN hg19.kgXref AS kxr ON kxr.kgID = kg.name
LEFT JOIN hg19.knownCanonical as kc on kc.transcript = kg.name
WHERE
  kxr.genesymbol = ${mysql.escape(gene)}
  and kg.chrom not like '%#_%' ESCAPE '#'
`)

  return result

}

const mySqlQueryTest = (genes, pool) => {

  db = new Database(pool)

  let geneList = ""

  for(gene of genes){
    geneList += `${mysql.escape(gene)},`
  }

  geneList = geneList.substr(0,geneList.length - 1)

  let query = 
`SELECT \
kg.name "knownGene.GeneName", \
kg.chrom "knownGene.chrom", \
kg.txStart "knownGene.txStart", \
kg.txEnd "knownGene.txEnd", \
kte.value "knownToEnsembl.EnsGeneID", \
kxr.mRNA "knownXref.mRNAID", \
kxr.spID "knownXref.UniProtProteinAccessionNumber", \
kxr.spDisplayID "knownXref.UniProtDisplayID", \
kxr.genesymbol "knownXref.GeneSymbol", \
kxr.refseq "knownXref.RefSeqID", \
kxr.protAcc "knownXref.NCBIProteinAccessionNumber", \
kxr.description "knownXref.Description", \
kxr.rfamAcc "knownXref.RfamAccessionNumber", \
kxr.tRnaName "knownXref.NameOfThetRNATrack", \
kc.transcript "knownCanonical.Transcript" \
FROM hg19.knownGene AS kg \
LEFT JOIN hg19.knownToEnsembl AS kte ON kte.name = kg.name \
LEFT JOIN hg19.kgXref AS kxr ON kxr.kgID = kg.name \
LEFT JOIN hg19.knownCanonical as kc on kc.transcript = kg.name \
WHERE
kxr.genesymbol = "HLA-B" and kg.chrom not like '%#_%' ESCAPE '#'`
  

  var result = db
    .query(query)

  return result
}

const mySqlQuery = (ensGenes,knownGenes,pool) => {

  db = new Database(pool)

  let knownGeneList = ""

  if(knownGenes.length == 0){
    knownGeneList   = `''`
  } else {
    for(gene of knownGenes){
      knownGeneList += `${mysql.escape(gene)},`
    }
  
    knownGeneList = knownGeneList.substr(0,knownGeneList.length - 1)
  }

  let query = `
  SELECT \
    kxr.GeneSymbol "name", \
    min(kg.txStart) "start", \
    max(kg.txEnd) "end", \
    "KnownGene" as "track" \
  FROM hg19.knownGene AS kg \
  LEFT JOIN hg19.kgXref AS kxr ON kxr.kgID = kg.name \
  where kxr.GeneSymbol in (${knownGeneList}) \
  and kg.chrom not like '%#_%' ESCAPE '#' \
  GROUP BY kxr.GeneSymbol \
`

var result = db
  .query(query)

return result
}

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz'
  res.set('Content-Encoding', 'gzip')
  res.set('Content-Type', 'text/javascript')
  next()
})

const publicDir = path.resolve(__dirname, 'dist')
app.use(express.static(publicDir))

//
app.use(cors());
app.options('localhost:3000', cors());

app.use(bodyParser.json())

app.get('/api/es/:searchTerm', (req, res) => {
  esQuery(req.params.searchTerm).then( results => {
    res.send(
        results.data
      )
  })
})

app.get('/api/es/varient/:geneSymbol/site/:site/chr/:chr/dataset/:dataset', (req, res) => {

  console.log(req.params.geneSymbol,req.params.site,req.params.chr,req.params.dataset)

  esVarientQuery(
    req.params.geneSymbol,
    req.params.site,
    req.params.chr,
    req.params.dataset
  ).then( results => {

    //Didn't index geneSymbol.  Fix later. Search results for now
    let ret = results.data.hits.hits.filter( o => (o._source.NonIndexedData.GeneSymbol == req.params.geneSymbol))

    res.send(
      ret[0]
      )
  })
})

app.post('/api/es/range', compression() ,(req, res) => {
  esQueryRange(req.body.rangeData).then( results => {
    res.send(
        results.data
      )
  })
})

app.get('/api/gene/:geneID', (req, res) => {
  getSiteRange(req.params.geneID,connectionPool).then( rows => {
    res.send(
      {
        genes: rows
      }
    )
  })
})

app.post('/api/gene/search', (req, res) => {

  mySqlQuery(req.body.ensGenes,req.body.knownGenes,connectionPool).then(rows => {
    res.send(
      {
        genes: rows
      }
    )
  })
})

app.post('/api/gene/test', (req, res) => {

  mySqlQueryTest(req.body.genes,connectionPool).then(rows => {

    console.log(rows.length)

    res.send(
      {
        genes: rows
      }
    )
  })
})

app.get('*', (request, response) => {
  response.sendFile(path.join(publicDir,'index.html'))
})

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))