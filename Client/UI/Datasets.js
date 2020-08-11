export const Datasets = {
    "pqtl":{
        displayName: "pQTL",
        datasets: [
            "pqtl"
        ],
        datasetLabels:[
            "pQTL",
        ]
    },
    "overlap":{
        displayName: "pQTL vs eQTL",
        datasets:[
            "pqtloverlap",
            "eqtloverlap",
        ],
        datasetLabels:[
            "pQTL",
            "eQTL",
        ]
    }
}

export const DatasetDisplayName = {
    "pqtl":{
        displayName: "pQTL",
        value: 'pqtl',
        downloadLabel: "pQTL",
    },
    "pqtlOverlap":{
        displayName: "eQTL vs pQTL",
        value: 'overlap',
        downloadLabel: "pQTL",
    },
    "eqtlOverlap":{
        displayName: "pQTL vs eQTL",
        value: 'overlap',
        downloadLabel: "eQTL",
    },
}

const columnData = (displayName, dbName, numFormat) => {
    return {displayName, dbName, numFormat}
}

export const tableCols = [
    columnData('Genomic Coordinates', (x) => x.Coordinate, false),
    columnData('Associated Gene', (x) => x.NonIndexedData.GeneSymbol, false),
    columnData('RefSNP Number', (x) => x.BystroData["gnomad.genomes.id"], false),
    columnData('P-Value', (x) => x.NonIndexedData.pvalue, true),
    columnData('T-Value', (x) => x.NonIndexedData.tvalue, true),
    columnData('FDR Adjusted P-Value', (x) => x.NonIndexedData.FDR,true),
]