const express = require('express')

const path = require('path')

const mysql = require('mysql')
const bodyParser = require('body-parser');
const cors = require('cors')
const compression = require('compression')
const rfs = require('rotating-file-stream')
const morgan = require('morgan')
const uuid = require('node-uuid')
const cookieSession = require('cookie-session')

const queries = require('./queries')

const connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: 'genome-mysql.soe.ucsc.edu',
    user: 'genome',
    port: '3306',
    database: 'hg19'
})

morgan.token('id', function getId (req) {
    return req.session.id
})

const app = express()

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

const assignId = (req, res, next) => {
    if(!req.session.id){
        req.session.id = uuid.v4()
    }
    next()
}

app.use(assignId)

// create a rotating write stream
const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

const format = ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'

// setup the logger
app.use(morgan(format, { stream: accessLogStream }))

app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz'
    res.set('Content-Encoding', 'gzip')
    res.set('Content-Type', 'text/javascript')
    next()
})

const publicDir = path.resolve(__dirname, '../dist')
app.use(express.static(publicDir))

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

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))
