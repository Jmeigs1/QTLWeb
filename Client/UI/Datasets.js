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

const columnData = (displayName, dbName) => {
    return {displayName, dbName}
}

export const tableCols = [
    columnData('Genomic Coordinates', (x) => x.Coordinate),
    columnData('Dataset', (x) => DatasetDisplayName[x.Dataset].downloadLabel),
    columnData('Associated Gene', (x) => x.NonIndexedData.GeneSymbol),
    columnData('RefSNP Number', (x) => x.BystroData["gnomad.genomes.id"]),
    columnData('P-Value', (x) => x.NonIndexedData.pvalue),
    columnData('Bonf Corrected P-Value', (x) => x.NonIndexedData.Bonferronipvalue),
    columnData('FDR', (x) => x.NonIndexedData.FDR),
]