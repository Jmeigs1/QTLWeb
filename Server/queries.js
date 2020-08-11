const axios = require('axios')
const mysql = require('mysql')

let esServerIP = 'http://localhost:9200'

try {
    esServerIP = require("./dev").esServer
} catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
        throw error;
    }
}


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
    constructor(pool) {
        this.pool = pool
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, args, (err, rows, fields) => {
                if (err)
                    return reject(err)
                resolve(rows)
            })
        })
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

const esVarientQuery = (geneSymbol, site, chr, dataset) => {

    if (!geneSymbol || !site || !chr || !dataset) {
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
                            "Chr": esSanitize(chr.toLowerCase())
                        }
                    },
                    {
                        "term": {
                            "Dataset": esSanitize(dataset.toLowerCase())
                        }
                    },
                    {
                        "term": {
                            "Site": esSanitize(site.toLowerCase())
                        }
                    }
                ]
            }
        }
    }

    return axios.post(esServerIP + '/searchresults/_search', reqBody)
}

const esQueryRange = (rangeData) => {

    let datasetTerms = []

    for (let i = 0; i < rangeData.dataset.length; i++) {
        datasetTerms.push({
            "term": {
                "Dataset": {
                    "value": rangeData.dataset[i]
                }
            }
        })
    }

    let reqObj = {
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
                        "range": {
                            "Site": {
                                "gte": rangeData.start,
                                "lt": rangeData.end
                            }
                        }
                    },
                    {
                        "bool": {
                            "should": datasetTerms
                        }
                    }
                ]
            }
        },
        "_source": [
            "Coordinate",
            "Site",
            "Chr",
            "Dataset",
            "NonIndexedData.*",
            "BystroData.gnomad.genomes.id"
        ]
    }

    return axios.post(esServerIP + '/searchresults/_search?scroll=1m',reqObj)
    .then(
        async (resp) => {

            results = resp.data.hits.hits

            var newResp = resp
            var scrollID = newResp.data._scroll_id
            var count = newResp.data.hits.hits.length

            while(count == 10000){
                newResp = await axios.post(esServerIP + '/_search/scroll',{
                    "scroll": "1m",
                    "scroll_id": scrollID,
                })

                scrollID = newResp.data._scroll_id
                count = newResp.data.hits.hits.length

                results = [...results,...newResp.data.hits.hits]
            }

            return results
        } 
    )
    .catch(err => console.log(err))
}

const getSiteRange = (gene, pool) => {

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

    for (gene of genes) {
        geneList += `${mysql.escape(gene)},`
    }

    geneList = geneList.substr(0, geneList.length - 1)

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

const mySqlQuery = (knownGenes, pool) => {

    db = new Database(pool)

    let knownGeneList = ""

    if (knownGenes.length == 0) {
        knownGeneList = `''`
    } else {
        for (gene of knownGenes) {
            knownGeneList += `${mysql.escape(gene)},`
        }

        knownGeneList = knownGeneList.substr(0, knownGeneList.length - 1)
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

module.exports = {
    esQuery,
    esVarientQuery,
    esQueryRange,
    getSiteRange,
    mySqlQueryTest,
    mySqlQuery,
}