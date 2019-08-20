import React, { Component } from 'react'
import styled from 'styled-components'
import { debounce } from 'throttle-debounce'

import ScatterPlot from './ScatterPlot'
import TranscriptPlot from './TranscriptPlot'
import GenePageTable from './GenePageTable'
import GenePageTableFilter from './GenePageTableFilter'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

import {min,max} from 'd3-array'
import {scaleLinear} from 'd3-scale'

import Colors from './UI/Colors'

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
            filterValue: ""
          }

        this.filterResultsFuncDB = debounce(
            250,
            this.filterResultsFunc
        )
    }

    componentDidMount() {
        this.loadAllData()
    }

    componentDidUpdate() {
        if(this.props.geneSymbol != this.state.geneSymbol){
            this.loadAllData()
            this.setState({
                geneSymbol: this.props.geneSymbol
            })
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
            window.location.host + '/api/gene/' + this.props.geneSymbol
        ).then(response => response.json())
    }

    loadDataResults(geneSymbol,rangeQueryData) {

        return fetch(
            window.location.host + '/api/es/range',
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

            var lines = data.hits.hits

            var fullData = lines.map(x => x._source)
            var pvals = lines.map(x => parseFloat(x._source.NonIndexedData.Log10pvalue))
            var genes = lines.map(x => x._source.NonIndexedData.EnsemblGeneID)

            genes.push(geneSymbol)

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
    }

    loadDataGene(genes) {

        return fetch(
            window.location.host + '/api/gene/search',
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

    filterResultsFunc = (filterText) => {

        let filteredData = this.state.resultsData.fullData.filter(
            (dataPoint) => (dataPoint.NonIndexedData.EnsemblGeneID.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
        )

        this.setState({
            filteredData: filteredData,
            filterValue: filterText
        })
    }

    render() {

        console.log("this.state:",this.state)

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
                    geneSymbol={this.state.geneSymbol}
                    dataLoaded={this.state.geneDataLoaded}
                    filteredData={this.state.filteredData} />
                <TranscriptPlot size={[1000,10]} 
                    d3Data={this.state.resultsData.d3Data}
                    geneSymbol={this.state.geneSymbol}
                    dataLoaded={this.state.geneDataLoaded}
                    filterResultsFunc={this.filterResultsFunc}
                    geneData={this.state.geneData}/>
                <GenePageTableFilter
                    geneSymbol={this.state.geneSymbol}
                    filterResultsFunc={this.filterResultsFuncDB}
                    filteredData={this.state.filteredData}
                    filterValue={this.state.filterValue}
                    />
                <GenePageTable size={[1000,500]} 
                    filteredData={this.state.filteredData}
                    />
            </Page>
        )
    }
}

let Genecard = (props) => {

    const [value, setValue] = React.useState('eqtl')

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    return (
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
            <p style={{fontWeight:"bold"}}> Dataset </p>
            <FormControl style={{
                boxShadow:"0px 1px 3px 0px rgba(0,0,0,0.2), \
                        0px 1px 1px 0px rgba(0,0,0,0.14), \
                        0px 2px 1px -1px rgba(0,0,0,0.12)",
                background: "#FFF",
                paddingTop:"5px",
                }} component="fieldset">
                <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>
                    <FormControlLabel
                    value="eqtl"
                    control={<Radio color="primary" />}
                    label={<div style={{fontSize:"20px"}}>EQTL</div>}
                    labelPlacement="top"
                    style={{fontSize:"20px"}}
                    />
                    <FormControlLabel
                    value="pqtl"
                    control={<Radio color="primary" />}
                    label={<div style={{fontSize:"20px"}}>PQTL</div>}
                    labelPlacement="top"
                    />
                </RadioGroup>
            </FormControl>
        </CardBox>
    )
}

Genecard = React.memo(Genecard)


export default GenePage;