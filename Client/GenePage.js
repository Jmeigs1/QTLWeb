import React, { Component } from 'react'
import styled from 'styled-components'
import { debounce } from 'throttle-debounce'

import DatasetFilter from './DatasetFilter'
import GeneCard from './GeneCard'
import GenePageTable from './GenePageTable'
import GenePageTableFilter from './GenePageTableFilter'
import Legend from './Legend'
import ScatterPlot from './ScatterPlot'
import TranscriptPlot from './TranscriptPlot'

import {Page} from './UI/BasicElements'
import {Datasets} from './UI/Datasets'

import {min,max} from 'd3-array'
import {scaleLinear} from 'd3-scale'

const CardBox = styled.div`
    margin: 10px;
    padding: 0 10px;
    float: left;
`

class GenePage extends Component {

    constructor(props){
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
    }

    shouldComponentUpdate(prevProps){
        //this change will always happen by itself
        return prevProps.loading == this.props.loading 
    }

    componentDidMount() {
        document.title = "QTL's - " + this.props.geneSymbol
        this.loadAllData()
    }

    componentDidUpdate(prevProps) {
        if(this.props.geneSymbol != prevProps.geneSymbol || prevProps.dataset != this.props.dataset){
            document.title = "QTL's - " + this.props.geneSymbol
            this.loadAllData()
        }
    }

    loadAllData(){
        if(!this.props.loading){
            this.props.setLoadingFunc(true, 
                () => {
                    this.props.setDatasetFunc(this.props.dataset)
                }    
            )
        }

        this.getSiteRange()
        .then( 
            (rangeQueryData) => this.loadDataResults(this.props.geneSymbol,rangeQueryData)
            .then(
                (resultsQueryResults) => {
                    this.loadDataGene(resultsQueryResults.genes)
                    .then(
                        (stateDI) => {this.loadD3Data(resultsQueryResults,stateDI)}
                    )
                    
                }
            )
        )
    }

    getSiteRange(){
        return fetch(
            window.location.origin + '/api/gene/' + this.props.geneSymbol
        ).then(response => response.json())
    }

    loadDataResults(geneSymbol,rangeQueryData) {

        const txStart = Math.min(...rangeQueryData.genes.map(o => parseInt(o["knownGene.txStart"])))
        const txEnd   = Math.max(...rangeQueryData.genes.map(o => parseInt(o["knownGene.txEnd"])))

        return fetch(
            window.location.origin + '/api/es/range',
            { 
                method: "POST",
                body: JSON.stringify({
                    rangeData:{
                        chr: rangeQueryData.genes[0]["knownGene.chrom"],
                        start: txStart - 100000,
                        end: txEnd + 100000,
                        dataset: Datasets[this.props.dataset].datasets,
                    },
                }),
                headers:{
                    'Content-Type': 'application/json',
                },
            }
        )
        .then(response => response.json())
        .then(data => {

            var lines = data

            var fullData = lines.map(x => x._source)
            var pvals = lines.map(x => parseFloat(x._source.NonIndexedData.log10pvalue))
            var genes = lines.map(x => x._source.NonIndexedData.GeneSymbol)

            genes.push(geneSymbol)

            return {
                geneName: geneSymbol,
                fullData: fullData,
                pvals: pvals,
                mainGeneTranscripts: rangeQueryData.genes,
                genes: genes.filter( (value, index, self) => (self.indexOf(value) === index)),
                range: {
                    'start':    txStart,
                    'end':      txEnd,
                    'padding':  100000,
                },
            }

        })
    }

    loadDataGene(genes) {

        return fetch(
            window.location.origin + '/api/gene/search',
            { 
                method: "POST",
                body: JSON.stringify({
                    knownGenes: genes,
                }),
                headers:{
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(response => response.json())
            .then( data => {

                return ({
                    geneData: data.genes,
                    geneDataLoaded: true,
                })

            })
    }

    loadD3Data(resultsQueryResults,stateDI){
        if(!resultsQueryResults)
            return

        const size = [1000,400]

        const d3Margin = {top: 10, right: 50, bottom: 40, left: 50},
        d3Width = size[0] - d3Margin.left - d3Margin.right,
        d3Height = size[1] - d3Margin.top - d3Margin.bottom

        let pvals = resultsQueryResults.pvals

        //Calculate here because we need the scale across components
        const d3Min = pvals ? min(pvals) : 0,
        d3Max = pvals ? max(pvals) : 10,
        dataMinSite = Math.max(resultsQueryResults.range.start - resultsQueryResults.range.padding,0),
        dataMaxSite = resultsQueryResults.range.end + resultsQueryResults.range.padding

        var d3ScaleX = scaleLinear()
            .domain([dataMinSite, dataMaxSite])
            .range([0, d3Width])
            .nice()

        var d3ScaleY = scaleLinear()
            .domain([d3Min, d3Max])
            .range([d3Height, 0])     
            .nice()

        var d3Data ={
            min:    d3Min,
            max:    d3Max,
            dataMinSite: dataMinSite,
            dataMaxSite: dataMaxSite,
            scaleX: d3ScaleX,
            scaleY: d3ScaleY,
            height: d3Height,
            width:  d3Width,
            margin: d3Margin,
            size: size,
        }

        this.setState(
            {
                ...stateDI,
                resultsData:{
                    ...resultsQueryResults,
                    dataLoaded: true,
                    d3Data: d3Data,
                },
                filteredData: resultsQueryResults.fullData,
                geneSymbol: this.props.geneSymbol,
                filterValue: "",
            },
            () => {this.props.setLoadingFunc(false)}
        )
    }

    filterDataFields =  [
        {
            fieldName: "GeneSymbol",
            getData: (d) => d.NonIndexedData.GeneSymbol,
        },
        {
            fieldName: "EnsID",
            getData: (d) => d.NonIndexedData.EnsemblGeneID,
        },
    ]

    filterResultsFunc = (filterText,cb) => {

        let filteredData = this.state.resultsData.fullData.filter(
            (dataPoint) => 
            {
                if(!filterText){
                    return true
                }

                let filterbool = false
                for(let dataField of this.filterDataFields){

                    let value = dataField.getData(dataPoint)
                    if(value && value.toLowerCase().indexOf(filterText.toLowerCase()) > -1){
                        filterbool = true
                        break
                    }
 
                }
                return filterbool
            }
        )

        this.setState({
            filteredData: filteredData,
            filterValue: filterText,
        },cb)
    }

    render() {

        console.log("this.state:",this.state)
        console.log("this.props:",this.props)

        if (!this.state.geneDataLoaded){
            return (
                <Page>
                </Page>
            )
        }

        return (
            <Page>
                <CardBox>
                    <GeneCard
                        mainGeneTranscripts={this.state.resultsData.mainGeneTranscripts}/>
                    <DatasetFilter
                        geneSymbol={this.props.geneSymbol}
                        dataset={this.props.dataset}
                        setDatasetFunc={this.props.setDatasetFunc}/>
                </CardBox>
                {/* <ScatterPlot geneData={this.state.geneData} scaleData={} size={[1000,500]}/> */}
                {Datasets[this.props.dataset].datasets.map(
                    (dataset, i) => {
                        return (
                            <ScatterPlot size={[1000,400]} 
                            key={i}
                            header={Datasets[this.props.dataset].datasetLabels[i]}
                            d3Data={this.state.resultsData.d3Data}
                            range={this.state.resultsData.range}
                            geneSymbol={this.props.geneSymbol}
                            filterResultsFunc={this.filterResultsFunc}
                            filteredData={this.state.filteredData.filter(
                                (o) => (o.Dataset.toLowerCase() == dataset)
                            )} />
                        )
                    }
                )}
                <Legend/>
                <h3>
                    Filters
                </h3>
                <TranscriptPlot size={[1000,10]} 
                    header="UCSC KnownGene Track"
                    d3Data={this.state.resultsData.d3Data}
                    geneSymbol={this.props.geneSymbol}
                    filterResultsFunc={this.filterResultsFunc}
                    geneData={this.state.geneData}
                    filterValue={this.state.filterValue}/>
                <GenePageTableFilter
                    geneSymbol={this.props.geneSymbol}
                    filterResultsFunc={this.filterResultsFuncDB}
                    filteredData={this.state.filteredData}
                    filterValue={this.state.filterValue}
                    />
                <GenePageTable size={[1000,500]} 
                    filteredData={this.state.filteredData}
                    dataset={this.props.dataset}
                    />
            </Page>
        )
    }
}

export default GenePage