import React, { Component } from 'react'
import styled from 'styled-components'
import { debounce } from 'throttle-debounce'

import * as TestData from './TestData'
import os from 'os'

import ScatterPlot from './ScatterPlot'
import TranscriptPlot from './TranscriptPlot'
import GenePageTable from './GenePageTable'
import GenePageTableFilter from './GenePageTableFilter'

import {min,max} from 'd3-array'
import {scaleLinear} from 'd3-scale'
import {format} from 'd3-format'


const Page = styled.div`
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    padding: 0 30px;
    margin: 0 auto;
    font-size: 16px;
`

const FlexDiv = styled.div`
    display: flex;
    flex-direction: right;

    > dt {width:200px; font-weight:bold};
    > dd {width:250px;margin: 0 10px};
`

const CardBox = styled.div`
    margin: 10px;
    padding: 0 10px;
    float: left;
`
const TranscriptWrapper = styled.div`
    width:1000px;
    height:300px;
    margin: auto 10px;
    background-color:black
`

class GenePage extends Component {

    constructor(props){
        super(props)

        this.state = {
            geneData: [],
            dataLoaded: false,
            geneSymbol: this.props.geneSymbol,
            resultsData: {},
            filteredData: {},
          }

        this.filterResults = debounce(
            250,
            this.filterResults
        )
    }

    componentDidMount() {
        this.loadAllData()
    }

    componentDidUpdate() {
        if(this.props.geneSymbol != this.state.geneSymbol){
            this.setState({
                geneSymbol: this.props.geneSymbol
            })
            this.loadAllData()
        }
    }

    loadAllData(){
        this.getSiteRange()
        .then( 
            (range) => this.loadDataResults(this.props.geneSymbol,range)
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
            'http://localhost:8080/api/gene/' + this.props.geneSymbol
        ).then(response => response.json())
    }

    loadDataResults(geneSymbol,rangeQueryData) {

        return fetch(
            'http://localhost:8080/api/es/range',
            { 
                method: "POST",
                body: JSON.stringify({
                    rangeData:{
                        chr: rangeQueryData.genes[0]["ensGene.chrom"],
                        start: rangeQueryData.genes[0]["ensGene.txStart"] - 100000,
                        end: rangeQueryData.genes[0]["ensGene.txEnd"] + 100000,
                    }
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(response => response.json())
        .then(data => {
            console.log("data.hits.hits",data.hits.hits)
            var lines = data.hits.hits

            var fullData = lines.map(x => x._source)
            var pvals = lines.map(x => x._source.NonIndexedData.Log10pvalue)
            var genes = lines.map(x => x._source.NonIndexedData.EnsemblGeneID)

            genes.push(geneSymbol)
            console.log(geneSymbol)

            return {
                geneName: geneSymbol,
                fullData: fullData,
                pvals: pvals,
                genes: genes.filter( (value, index, self) => (self.indexOf(value) === index)),
                range: {
                    'start':    rangeQueryData.genes[0]["ensGene.txStart"],
                    'end':      rangeQueryData.genes[0]["ensGene.txEnd"],
                    'padding':  100000
                },
            }

        })

        // var pvals = TestData.geneData

        // var lines = pvals.split(os.EOL)

        // var fullData = []
        // var pvals = []
        // var genes = []
        // var line
        
        // for(var i = 0; i < lines.length; i++){
        //     line = lines[i].split(' ')
        //     pvals.push(line[3])
        //     genes.push(line[1].toString())
        //     fullData.push(
        //         {
        //             'gene': line[1].toString(),
        //             'pos':  parseInt(line[2]),
        //             'pVal': line[3]
        //         }
        //     )
        // }

        // genes.push(geneSymbol)

        // return {
        //     geneName: geneSymbol,
        //     fullData: fullData,
        //     pvals: pvals,
        //     genes: genes.filter( (value, index, self) => (self.indexOf(value) === index)),
        //     range: {
        //         'start':    rangeQueryData.genes[0]["ensGene.txStart"],
        //         'end':      rangeQueryData.genes[0]["ensGene.txEnd"],
        //         'padding':  100000
        //     },
        // }
    }

    loadDataGene(genes) {

        return fetch(
            'http://localhost:8080/api/gene/search',
            { 
                method: "POST",
                body: JSON.stringify({
                    genes: genes
                }),
                headers:{
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(response => response.json())
            .then( data => {

                //Check for no data
                if(data.genes.length > 0){

                    let index = 0
                    let found = false

                    for(const [i,row] of data.genes.entries()){
                        if(row['ensGene.GeneID'] ==  this.props.geneSymbol){
                            index = i
                            found = true
                            break
                        }
                    }

                    if(!found){
                        console.log("Gene query failed")
                    }

                    return ({
                        geneData: data.genes,
                        mainGeneIndex: index,
                        geneDataLoaded: true
                    })
                }
                else{
                    return({
                        geneDataLoaded: false
                    })
                }
            })
    }

    loadD3Data(resultsQueryResults,stateDI){
        if(!resultsQueryResults)
            return

        const size = [1000,400]

        const d3Margin = {top: 10, right: 10, bottom: 40, left: 50},
        d3Width = size[0] - d3Margin.left - d3Margin.right,
        d3Height = size[1] - d3Margin.top - d3Margin.bottom

        let pvals = resultsQueryResults.pvals

        //Calculate here because we need the scale across components
        const d3Min = min(pvals),
        d3Max = max(pvals),
        dataMinSite = resultsQueryResults.range.start - resultsQueryResults.range.padding,
        dataMaxSite = resultsQueryResults.range.end + resultsQueryResults.range.padding

        var d3ScaleX = scaleLinear()
            .domain([Math.max(dataMinSite,0), dataMaxSite])
            .range([0, d3Width])
            .nice()
            // .tickFormat(format("s"))

        var d3ScaleY = scaleLinear()
            .domain([d3Min, d3Max])
            .range([d3Height, 0])     
            .nice()
            // .tickFormat(format("s"))

        var d3Data ={
            min:    d3Min,
            max:    d3Max,
            scaleX: d3ScaleX,
            scaleY: d3ScaleY,
            height: d3Height,
            width:  d3Width,
            margin: d3Margin,
            size: size
        }

        this.setState(
            {
                ...stateDI,
                resultsData:{
                    ...resultsQueryResults,
                    dataLoaded: true,
                    d3Data: d3Data
                },
                filteredData: resultsQueryResults.fullData,
            }
        )
    }

    filterResults = (filterText) => {

        let filteredData = this.state.resultsData.fullData.filter(
            (dataPoint) => (dataPoint.NonIndexedData.EnsemblGeneID.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
        )
        
        console.log("filteredData.length: ", filteredData.length)
        console.log("filteredData: ", filteredData)

        this.setState({
            filteredData: filteredData
        })
    }

    render() {

        console.log(this.state)

        if (!this.state.geneDataLoaded){
            return (
                <Page>
                </Page>
            )
        }

        return (
            <Page>
                <Genecard geneData={this.state.geneData[this.state.mainGeneIndex]}/>
                {/* <ScatterPlot geneData={this.state.geneData} scaleData={} size={[1000,500]}/> */}
                <ScatterPlot size={[1000,400]} 
                    d3Data={this.state.resultsData.d3Data}
                    range={this.state.resultsData.range}
                    geneSymbol={this.props.geneSymbol}
                    dataLoaded={this.state.geneDataLoaded}
                    filteredData={this.state.filteredData} />
                <TranscriptPlot size={[1000,10]} 
                    d3Data={this.state.resultsData.d3Data}
                    geneSymbol={this.props.geneSymbol}
                    dataLoaded={this.state.geneDataLoaded}
                    geneData={this.state.geneData}/>
                <GenePageTableFilter
                    geneSymbol={this.props.geneSymbol}
                    filterResults={this.filterResults}/>
                <GenePageTable size={[1000,500]} 
                    filteredData={this.state.filteredData}
                    />
            </Page>
        )
    }
}

let Genecard = (props) => (

    <CardBox>
        <h2>{props.geneData["knownXref.GeneSymbol"]}</h2>
        <h3>{Buffer.from( props.geneData["knownXref.Description"],'utf-8' ).toString().split(',')[0]}</h3>
        <dl>
            <FlexDiv><dt>Ensembl gene ID: </dt> <dd>{props.geneData["ensGene.GeneID"]}</dd></FlexDiv>
            <FlexDiv><dt>Uniprot: </dt> <dd>{props.geneData["knownXref.UniProtDisplayID"]}</dd></FlexDiv>
            <FlexDiv>
                <dt>Location: </dt>
                <dd>
                    {props.geneData["ensGene.chrom"]}: {props.geneData["ensGene.txStart"]} - {props.geneData["ensGene.txEnd"]}
                </dd>
            </FlexDiv>
            <FlexDiv>
            <dt>Size: </dt>
                <dd>
                    {0 + props.geneData["ensGene.txEnd"] - props.geneData["ensGene.txStart"]}
                </dd>
            </FlexDiv>
        </dl>
        <select>
            <option value="volvo">eQTL</option>
            <option value="volvo">pQTL</option>
        </select>
    </CardBox>
)

Genecard = React.memo(Genecard)


export default GenePage;