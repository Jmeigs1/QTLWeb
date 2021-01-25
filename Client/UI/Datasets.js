export const Datasets = {
    "rosmap":{
        displayName: "ROS/MAP",
        datasets: [
            "rosmap"
        ],
        datasetLabels:[
            "ROS/MAP",
        ]
    },
    "rosmap_control":{
        displayName: "ROS/MAP Control",
        datasets:[
            "rosmap_control",
        ],
        datasetLabels:[
            "Rosmap Control",
        ]
    },
    "banner":{
        displayName: "Banner",
        datasets: [
            "banner"
        ],
        datasetLabels:[
            "Banner",
        ]
    },
}

export const DatasetDisplayName = {
    "rosmap":{
        displayName: "ROS/MAP",
        value: 'rosmap',
        downloadLabel: "ROS/MAP",
    },
    "rosmap_control":{
        displayName: "ROS/MAP Control",
        value: 'rosmap_control',
        downloadLabel: "ROS/MAP Control",
    },
    "banner":{
        displayName: "Banner",
        value: 'banner',
        downloadLabel: "Banner",
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