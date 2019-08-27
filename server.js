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
    "size":10,
    "query": {
      "query_string" : {
          "analyze_wildcard": true,
          "query":    esSanitize(searchTerm) + "*",
          "analyzer": "lowercasespaceanalyzer",
          "fields": [ "GeneSymbol", "UniprotID", "EnsID", "ProteinName","Coordinate","RsNum" ] 
        }
    },
    "highlight" : {
      "fields" : {
          "*" : {}
      },
      "number_of_fragments":1,
      "type":"plain"
  }
  }

  return axios.post('http://localhost:9200/searchresults/_search', reqBody)
}

const esQueryRange = (rangeData) => {

  return axios.post(
          'http://localhost:9200/searchresults/_search',
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
                                "value": "eqtloverlap"
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
SELECT \
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
  kxr.genesymbol = ${mysql.escape(gene)}
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

  console.log(geneList)

  var result = db
    .query(`SELECT
    e.name2 "ens_id",
    kxr.spID "uniprot_id",
    kxr.genesymbol "genesymbol",
    kg.name "protein_name",
    kg.chrom "chr"
    FROM hg19.knownGene AS kg
    JOIN hg19.kgXref AS kxr ON kxr.kgID = kg.name
    LEFT JOIN hg19.knownToEnsembl AS kte ON kte.name = kg.name
    LEFT JOIN hg19.ensGene AS e on e.name = kte.value
    where e.chrom != "chrX" and e.chrom != "chrY" and kxr.genesymbol = "PCDHGC3"`   )

  return result
}

const mySqlQuery = (ensGenes,knownGenes,pool) => {

  db = new Database(pool)

  let ensGeneList   = ""
  let knownGeneList = ""

  for(gene of ensGenes){
    ensGeneList += `${mysql.escape(gene)},`
  }

  ensGeneList = ensGeneList.substr(0,ensGeneList.length - 1)

  for(gene of knownGenes){
    knownGeneList += `${mysql.escape(gene)},`
  }

  knownGeneList = knownGeneList.substr(0,knownGeneList.length - 1)

  var result = db
    .query(`    
  SELECT \
    e.name2 "name", \
    min(e.txStart) "start", \
    max(e.txEnd) "end", \
    "ENSGene" as "track" \
  FROM hg19.ensGene AS e \
  WHERE e.name2 in (${ensGeneList}) \
  GROUP BY e.name2 \
  UNION \
  SELECT \
    kxr.GeneSymbol "name", \
    min(kg.txStart) "start", \
    max(kg.txEnd) "end", \
    "KnownGene" as "track" \
  FROM hg19.knownGene AS kg \
  LEFT JOIN hg19.kgXref AS kxr ON kxr.kgID = kg.name \
  where kxr.GeneSymbol in (${knownGeneList}) \
  GROUP BY kxr.GeneSymbol \
`)

return result
}

app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz'
  res.set('Content-Encoding', 'gzip')
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

    console.log(rows)
    
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