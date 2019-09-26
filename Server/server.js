const express = require('express')

const path = require('path')

const mysql = require('mysql')
const bodyParser = require('body-parser');
const cors = require('cors')
const compression = require('compression')

const axios = require('axios')

const queries = require('./queries')

const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: 'genome-mysql.soe.ucsc.edu',
    user: 'genome',
    port: '3306',
    database: 'hg19'
})

const app = express()

app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz'
    res.set('Content-Encoding', 'gzip')
    res.set('Content-Type', 'text/javascript')
    next()
})

const publicDir = path.resolve(__dirname, '../dist')
app.use(express.static(publicDir))

//
app.use(cors());
app.options('localhost:3000', cors());

app.use(bodyParser.json())

app.get('/api/es/:searchTerm', (req, res) => {
    queries.esQuery(req.params.searchTerm).then(results => {
        res.send(
            results.data
        )
    })
})

app.get('/api/es/varient/:geneSymbol/site/:site/chr/:chr/dataset/:dataset', (req, res) => {

    console.log(req.params.geneSymbol, req.params.site, req.params.chr, req.params.dataset)

    queries.esVarientQuery(
        req.params.geneSymbol,
        req.params.site,
        req.params.chr,
        req.params.dataset
    ).then(results => {

        //Didn't index geneSymbol.  Fix later. Search results for now
        let ret = results.data.hits.hits.filter(o => (o._source.NonIndexedData.GeneSymbol == req.params.geneSymbol))

        res.send(
            ret[0]
        )
    })
})

app.post('/api/es/range', compression(), (req, res) => {
    queries.esQueryRange(req.body.rangeData).then(results => {
        console.log(results)
        res.send(
            results
        )
    })
})

app.get('/api/gene/:geneID', (req, res) => {
    queries.getSiteRange(req.params.geneID, connectionPool).then(rows => {
        res.send(
            {
                genes: rows
            }
        )
    })
})

app.post('/api/gene/search', (req, res) => {

    queries.mySqlQuery(req.body.knownGenes, connectionPool).then(rows => {
        res.send(
            {
                genes: rows
            }
        )
    })
})

app.post('/api/gene/test', (req, res) => {

    queries.mySqlQueryTest(req.body.genes, connectionPool).then(rows => {

        console.log(rows.length)

        res.send(
            {
                genes: rows
            }
        )
    })
})

app.get('*', (request, response) => {
    response.sendFile(path.join(publicDir, 'index.html'))
})

let server = app

if(process.env.NODE_ENV && process.env.SSL_PASS){
    server = https.createServer({
                key: fs.readFileSync('../ssl/server.key'),
                cert: fs.readFileSync('../ssl/server.crt'),
                passphrase: process.env.SSL_PASS,
            }, app)
}

server.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))
