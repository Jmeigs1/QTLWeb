const express = require('express')

const path = require('path')

const mysql = require('mysql')
const bodyParser = require('body-parser');
const cors = require('cors')

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

class Database {
  constructor( config ) {
      this.connection = mysql.createConnection( config )
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows, fields ) => {
              if ( err )
                  return reject( err )
              resolve( rows )
          } )
      } )
  }
  close(rows) {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  return reject( err )
          } )
          resolve(rows)
      } );
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

  return axios.post('http://localhost:9200/searchresults/_search', {
          "size":10000,
          "query": {
            "bool": {
            "must": [{
                "term": {
                  "Chr": rangeData.chr
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
        }
        })
}

const getSiteRange = (gene) => {

  db = new Database({
    host     : 'genome-mysql.soe.ucsc.edu',
    user     : 'genome',
    port     : '3306',
    database : 'hg19'
    // multipleStatements: true
  })

  var result = db
    .query(`    
SELECT \
max(e.chrom) "ensGene.chrom", \
min(e.txStart) "ensGene.txStart", \
max(e.txEnd) "ensGene.txEnd" \
FROM hg19.ensGene AS e \
where name2 = ${mysql.escape(gene)} \
Group By e.name2
`)



  result.then(
    () => {console.log("Closed getSiteRange");db.close()}
  )

  return result

}

const mySqlQueryTest = (genes) => {

  db = new Database({
    host     : 'genome-mysql.soe.ucsc.edu',
    user     : 'genome',
    port     : '3306',
    database : 'hg19'
    // multipleStatements: true
  })

  let geneList = ""

  for(gene of genes){
    geneList += `${mysql.escape(gene)},`
  }

  geneList = geneList.substr(0,geneList.length - 1)

  var result = db
    .query(`    
SELECT \
* \
from hg19.knownToEnsembl AS kte \
where kte.name = "uc001abo.3" \
`)

  result.then(
    () => {console.log("Closed mySqlQuery");db.close()}
  )

  return result
}

const mySqlQuery = (genes) => {

  db = new Database({
    host     : 'genome-mysql.soe.ucsc.edu',
    user     : 'genome',
    port     : '3306',
    database : 'hg19'
    // multipleStatements: true
  })

  let geneList = ""

  for(gene of genes){
    geneList += `${mysql.escape(gene)},`
  }

  geneList = geneList.substr(0,geneList.length - 1)

  var result = db
    .query(`    
SELECT \
e.name "ensGene.TranscriptID", \
e.name2 "ensGene.GeneID", \
e.chrom "ensGene.chrom", \
e.strand "ensGene.strand", \
e.txStart "ensGene.txStart", \
e.txEnd "ensGene.txEnd", \
e.cdsStart "ensGene.cdsStart", \
e.cdsEnd "ensGene.cdsEnd", \
e.exonCount "ensGene.exonCount", \
e.exonStarts "ensGene.exonStarts", \
e.exonEnds "ensGene.exonEnds", \
kte.name "knownToEnsembl.KnownGeneID", \
kxr.mRNA "knownXref.mRNAID", \
kxr.spID "knownXref.UniProtProteinAccessionNumber", \
kxr.spDisplayID "knownXref.UniProtDisplayID", \
kxr.genesymbol "knownXref.GeneSymbol", \
kxr.refseq "knownXref.RefSeqID", \
kxr.protAcc "knownXref.NCBIProteinAccessionNumber", \
kxr.description "knownXref.Description", \
kxr.rfamAcc "knownXref.RfamAccessionNumber", \
kxr.tRnaName "knownXref.NameOfThetRNATrack", \
kg.name "knownGene.GeneName", \
kg.chrom "knownGene.chrom", \
kg.txStart "knownGene.txStart", \
kg.txEnd "knownGene.txEnd", \
kg.cdsStart "knownGene.cdsStart", \
kg.cdsEnd "knownGene.cdsEnd", \
kg.exonStarts "knownGene.exonStarts", \
kg.exonEnds "knownGene.exonEnds" \
FROM hg19.ensGene AS e \
JOIN hg19.knownToEnsembl AS kte ON kte.value = e.name \
JOIN hg19.kgXref AS kxr ON kxr.kgID = kte.name \
JOIN hg19.knownGene AS kg on kg.name = kte.name \
JOIN hg19.knownCanonical as kc on kc.transcript = kxr.kgID \
where e.name2 in (${geneList})\
`)

  result.then(
    () => {console.log("Closed mySqlQuery");db.close()}
  )

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

app.post('/api/es/range', (req, res) => {
  esQueryRange(req.body.rangeData).then( results => {
    res.send(
        results.data
      )
  })
})

app.get('/api/gene/:geneID', (req, res) => {
  getSiteRange(req.params.geneID).then( rows => {
    res.send(
      {
        genes: rows
      }
    )
  })
})

app.post('/api/gene/search', (req, res) => {

  mySqlQuery(req.body.genes).then(rows => {
    res.send(
      { 
        genes: rows
      }
    )
  })
})

app.post('/api/gene/test', (req, res) => {

  // mySqlQuery(['ENSG00000198744']).then(rows => {
  mySqlQueryTest(['ENSG00000225972']).then(rows => {

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