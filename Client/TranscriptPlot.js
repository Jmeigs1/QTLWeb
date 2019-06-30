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
        console.log(this.state)
        
    }

    TestData = () => {
        
    }

    render() {
        var items = []

        if(this.state.geneData){

            for(let gene in this.state.geneData){
                var starts = Buffer.from( this.state.geneData[gene]["knownGene.exonStarts"],'utf-8' ).toString()
                var ends = Buffer.from( this.state.geneData[gene]["knownGene.exonEnds"],'utf-8' ).toString()

                items.push(<li> {starts} </li>)
                items.push(<li> {ends} </li>)
                items.push(<li> </li>)
            }
        }


        return (
            <div>
                {items}
            </div>
        );
    }
}

export default TranscriptPlot;