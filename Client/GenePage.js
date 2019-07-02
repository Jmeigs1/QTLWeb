import React, { Component } from 'react'
import styled from 'styled-components'

import * as TestData from './TestData'
import os from 'os'

import ScatterPlot from './ScatterPlot'
import TranscriptPlot from './TranscriptPlot'

import {min,max} from 'd3-array'
import {scaleLinear} from 'd3-scale'


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
            resultsData: null,
          };
    }

    componentDidMount() {
        this.loadDataGene(this.props.geneSymbol)
        .then(() => {this.loadDataResults(this.props.geneSymbol)})
    }

    componentDidUpdate() {
        if(this.props.geneSymbol != this.state.geneSymbol){
            this.setState({
                geneSymbol: this.props.geneSymbol
            })
            this.loadDataGene(this.props.geneSymbol)
            .then(() => {this.loadDataResults(this.props.geneSymbol)})
        }
    }

    loadDataResults(geneSymbol) {
        var pvals = TestData.geneData

        // fetch('/file.txt')
        // .then(res => {return res.text()})
        // .then(data => {
        //     pvals = data
        //     })

        var lines = pvals.split(os.EOL)

        var fullData = []
        var pvals = []
        var line
        
        for(var i = 0; i < lines.length; i++){
            line = lines[i].split(' ')
            pvals.push(line[3])
            fullData.push(
                {
                    'gene': line[1].toString(),
                    'pos':  parseInt(line[2]),
                    'pVal': line[3]
                }
            )
        }
        
        const size = [1000,500]

        const d3Margin = {top: 10, right: 10, bottom: 40, left: 50},
        d3Width = size[0] - d3Margin.left - d3Margin.right,
        d3Height = size[1] - d3Margin.top - d3Margin.bottom

        //Calculate here because we need the scale across components
        const d3Min = min(pvals),
        d3Max = max(pvals),
        dataMinSite = this.state.geneData.genes[this.state.mainGeneIndex]["ensGene.txStart"] - 100000,
        dataMaxSite = this.state.geneData.genes[this.state.mainGeneIndex]["ensGene.txEnd"] + 100000

        var d3ScaleX = scaleLinear()
            .domain([Math.max(dataMinSite,0), dataMaxSite])
            .range([0, d3Width])
            .nice()

        var d3ScaleY = scaleLinear()
            .domain([d3Min, d3Max])
            .range([d3Height, 0])     
            .nice()

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
                resultsData:{    
                    range: {
                        'start':this.state.geneData.genes[this.state.mainGeneIndex]["ensGene.txStart"],
                        'end':this.state.geneData.genes[this.state.mainGeneIndex]["ensGene.txEnd"],
                        'padding':100000
                    },
                    geneName: geneSymbol,
                    fullData: fullData,
                    pvals: pvals,
                    dataLoaded: true,
                    d3Data: d3Data
                }
            }
        )

    }

    loadDataGene(geneSymbol) {
        return fetch('http://localhost:8080/api/gene/' + this.props.geneSymbol)
            .then(response => response.json())
            .then( data => {
                //Check for no data
                if(data.genes.length > 0){

                    let index = 0

                    for(const [i,row] of data.genes.entries()){
                        console.log(row['knownXref.GeneSymbol'], ': ', i)
                        if(row['knownXref.GeneSymbol'] ==  geneSymbol){
                            index = i
                        }
                    }

                    this.setState({
                        geneData: data,
                        mainGeneIndex: index,
                        geneDataLoaded: true
                    })
                }
                else{
                    this.setState({
                        geneDataLoaded: false
                    })
                }
            })
    }

    render() {

        if (!this.state.geneDataLoaded){
            return (
                <Page>
                </Page>
            )
        }

        return (
            <Page>
                <Genecard geneData={this.state.geneData.genes[this.state.mainGeneIndex]}/>
                {/* <ScatterPlot geneData={this.state.geneData} scaleData={} size={[1000,500]}/> */}
                <ScatterPlot resultsData={this.state.resultsData} size={[1000,500]}/>
                <TranscriptPlot resultsData={this.state.resultsData} geneData={this.state.geneData.genes}/>
            </Page>
        )
    }
}

const Genecard = (props) => (

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
    </CardBox>
)

export default GenePage;