import React, { Component } from 'react'
import styled from 'styled-components'
import { debounce } from 'throttle-debounce'

import DatasetFilter from './DatasetFilter'
// import GeneCard from './GeneCard'
// import GenePageTable from './GenePageTable'
// import GenePageTableFilter from './GenePageTableFilter'
import Legend from './Legend'
import ScatterPlot from './ScatterPlot'
// import TranscriptPlot from './TranscriptPlot'

import { Page } from './UI/BasicElements'
import { Datasets /*, tableCols */ } from './UI/Datasets'

import { extent } from 'd3-array'
import { scaleLinear } from 'd3-scale'

const CardBox = styled.div`
    margin: 10px;
    padding: 0 10px;
    float: left;
`

class GenePage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            geneData: [],
            resultsData: {},
            filteredData: {},
            filterValue: "",
        }

        this.filterResultsFuncDB = debounce(
            250,
            this.filterResultsFunc
        )

        this._genePageTable = React.createRef()
    }

    shouldComponentUpdate(prevProps) {
        //this change will always happen by itself
        return prevProps.loading == this.props.loading
    }

    componentDidMount() {
        document.title = "QTL's - " + this.props.geneSymbol
        this.loadAllData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.geneSymbol != prevProps.geneSymbol || prevProps.dataset != this.props.dataset) {
            this.componentDidMount()
        }
    }

    async loadAllData() {
        console.time('loadAllData')
        if (!this.props.loading)
            this.props.setLoadingFunc(true, () => {
                this.props.setDatasetFunc(this.props.dataset)
            })

        const resultsQueryResults = await this.getSiteRange()
            .then(rangeQueryData => this.loadDataResults(this.props.geneSymbol, rangeQueryData))
        const stateDI = await this.loadDataGene(resultsQueryResults.genes)
        await this.loadD3Data(resultsQueryResults, stateDI)
        this.props.setLoadingFunc(false)
        console.timeEnd('loadAllData')
    }

    getSiteRange() {
        return fetch(
            'http://brainqtl.org:8080' + '/api/gene/' + this.props.geneSymbol
        ).then(response => response.json())
    }

    loadDataResults(geneSymbol, rangeQueryData) {
        const txStart = Math.min(...rangeQueryData.genes.map(o => +o["knownGene.txStart"]))
        const txEnd = Math.max(...rangeQueryData.genes.map(o => +o["knownGene.txEnd"]))

        return fetch('http://brainqtl.org:8080' + '/api/es/range', {
            method: "POST",
            body: JSON.stringify({
                rangeData: {
                    chr: rangeQueryData.genes[0]["knownGene.chrom"],
                    start: txStart - 100000,
                    end: txEnd + 100000,
                    dataset: Datasets[this.props.dataset].datasets,
                },
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                var lines = data

                var fullData = lines.map((x, i) => {
                    let ret = x._source
                    ret.index = i
                    ret.filterdIndex = i
                    return ret
                })
                var pvals = lines.map(x => +x._source.NonIndexedData.log10pvalue)
                var genes = lines.map(x => x._source.NonIndexedData.GeneSymbol)

                genes.push(geneSymbol)

                return {
                    geneName: geneSymbol,
                    fullData: fullData,
                    pvals: pvals,
                    mainGeneTranscripts: rangeQueryData.genes,
                    genes: [...new Set(genes)],
                    range: {
                        'start': txStart,
                        'end': txEnd,
                        'padding': 100000,
                    },
                }

            })
    }

    loadDataGene(genes) {

        return fetch('http://brainqtl.org:8080' + '/api/gene/search', {
            method: "POST",
            body: JSON.stringify({ knownGenes: genes }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => ({
                geneData: data.genes,
                geneDataLoaded: true,
            }))
    }

    loadD3Data(resultsQueryResults, stateDI) {
        if (!resultsQueryResults) return

        let padding = { left: 20, top: 30, right: 20, bottom: 30 }
        let width = 1070
        let height = 550

        let points = resultsQueryResults.fullData.map(p => ({
            position: +p.NonIndexedData.SNPGenomicPosition,
            pvalue: +p.NonIndexedData.log10pvalue,
            gene: p.NonIndexedData.GeneSymbol,
            chromosome: p.NonIndexedData.Chromosome,
            bystroId: p.BystroData['gnomad.genomes.id'],
            dataset: p.Dataset,
        }))
        let window = {
            width, height, padding,
            gene: resultsQueryResults.geneName,
            xScale: scaleLinear()
                .domain(extent(points, d => d.position))
                .range([padding.left, width - padding.right]),
            yScale: scaleLinear()
                .domain(extent(points, d => d.pvalue))
                .range([height - padding.top, padding.bottom]),
        }

        this.setState({
            geneDataLoaded: true,
            resultsData: {
                d3Data: {
                    points,
                    window,
                    genes: stateDI,
                },
            },
        })
    }

    // filterDataFields = [
    //     {
    //         fieldName: "GeneSymbol",
    //         getData: (d) => d.NonIndexedData.GeneSymbol,
    //     },
    //     {
    //         fieldName: "EnsID",
    //         getData: (d) => d.NonIndexedData.EnsemblGeneID,
    //     },
    // ]

    // filterResultsFunc = (filterText, cb) => {

    //     this.setState({
    //         filterValue: filterText,
    //     })

    //     this._genePageTable.current.setState({ "highlightIndex": -1 })

    //     let filteredData = this.state.resultsData.fullData

    //     if (filterText) {
    //         filteredData = this.state.resultsData.fullData.filter(
    //             (dataPoint) => {
    //                 if (!filterText) return true

    //                 let filterbool = false
    //                 for (let dataField of tableCols) {

    //                     let value = dataField.dbName(dataPoint)
    //                     if (value && value.toLowerCase().indexOf(filterText.toLowerCase()) > -1) {
    //                         filterbool = true
    //                         break
    //                     }

    //                 }
    //                 return filterbool
    //             }
    //         )

    //         for (let i = 0; i < filteredData.length; i++) {
    //             filteredData[i].filterdIndex = i
    //         }
    //     }

    //     this.setState({
    //         filteredData: filteredData,
    //     }, cb)
    // }

    render() {


        if (!this.state.geneDataLoaded) return (<Page />)

        return (
            <Page>
                <CardBox>
                    {/* <GeneCard
                        mainGeneTranscripts={this.state.resultsData.mainGeneTranscripts} /> */}
                    <DatasetFilter
                        geneSymbol={this.props.geneSymbol}
                        dataset={this.props.dataset}
                        setDatasetFunc={this.props.setDatasetFunc} />
                </CardBox>
                {/* <ScatterPlot geneData={this.state.geneData} scaleData={} size={[1000,500]}/> */}
                <ScatterPlot
                    header={Datasets[this.props.dataset].displayName}
                    d3Data={this.state.resultsData.d3Data}
                // genePageTableRef={this._genePageTable}
                // filterResultsFunc={this.filterResultsFunc}
                />
                <Legend />
                <h3>
                    Filters
                </h3>
                {/* <GenePageTableFilter
                    geneSymbol={this.props.geneSymbol}
                    filterResultsFunc={this.filterResultsFuncDB}
                    filteredData={this.state.filteredData}
                    filterValue={this.state.filterValue}
                />
                <GenePageTable
                    size={[1000, 500]}
                    ref={this._genePageTable}
                    filterValue={this.state.filterValue}
                    filteredData={this.state.filteredData}
                    dataset={this.props.dataset}
                /> */}
            </Page>
        )
    }
}

export default GenePage