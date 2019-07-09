import React, { Component } from 'react';
import styled from 'styled-components'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
`

class TranscriptPlot extends Component {

    constructor(props){
        super(props)
        this.createTranscriptPlot = this.createTranscriptPlot.bind(this)
    }

    state = {
        resultsData: {
            geneName: ''
        }
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate() {
        if(this.props.resultsData.geneName != this.state.resultsData.geneName){
            this.loadData()
        }
    }

    loadData() {
        if(this.props.resultsData){
            this.setState({
                resultsData: {...this.props.resultsData},
                geneData: {...this.props.geneData}
            },
            () => {this.createTranscriptPlot()})
        }
    }

    createTranscriptPlot(){
        let d3Data = this.state.resultsData.d3Data

    }

    TestData = () => {
        
    }

    render() {
        var items = []

        if(this.state.geneData){
            let i = 0

            for(let gene in this.state.geneData){
                // var starts = Buffer.from( this.state.geneData[gene]["ensGene.txStart"],'utf-8' ).toString()
                var starts = this.state.geneData[gene]["ensGene.txStart"]
                // var ends = Buffer.from( this.state.geneData[gene]["ensGene.txEnd"],'utf-8' ).toString()
                var ends = this.state.geneData[gene]["ensGene.txEnd"]

                items.push(<li key={4*i+0} > {this.state.geneData[gene]["knownXref.GeneSymbol"]} </li>)
                items.push(<li key={4*i+1} > {starts} </li>)
                items.push(<li key={4*i+2} > {ends} </li>)
                items.push(<li key={4*i+3} > </li>)
                i++
            }
        }


        return (
            <div>
                {/* {items} */}
                <Svg id="TranscriptArea" ref={node => this.node = node}
                    width={this.props.size[0]} height={this.props.size[1]}>
                </Svg>
            </div>
        );
    }
}

export default TranscriptPlot;