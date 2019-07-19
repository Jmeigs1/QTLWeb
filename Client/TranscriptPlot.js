import React, { Component } from 'react';
import styled from 'styled-components'

import colors from './UI/Colors'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
    cursor: pointer;
`

const TranscriptionRect = styled.rect`
    cursor: pointer;
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
        // let d3Data = this.state.resultsData.d3Data

    }

    handleMouseOver(event) {

        let rect = event.target
        rect.setAttribute('fill',colors[2][0])
    }

    handleMouseOut(event) {

        let rect = event.target
        rect.setAttribute('fill','black')    
    }

    TestData = () => {
        
    }

    render() {
        let items = []
        if(this.state.geneData && this.state.resultsData){
            for(let gene in this.state.geneData){
                // let starts = Buffer.from( this.state.geneData[gene]["ensGene.txStart"],'utf-8' ).toString()
                let start = this.state.geneData[gene]["ensGene.txStart"]
                // let ends = Buffer.from( this.state.geneData[gene]["ensGene.txEnd"],'utf-8' ).toString()
                let end = this.state.geneData[gene]["ensGene.txEnd"]
                let name = this.state.geneData[gene]["knownXref.GeneSymbol"]

                items.push({
                    name: name,
                    start: start,
                    end: end
                })
            }
        }
        
        if(!this.state.resultsData.d3Data)
            return (<div/>)

        return (
            <div>
                <p>
                    Gene Coding Regions
                </p>
                <Svg id="TranscriptArea" ref={node => this.node = node}
                    width={this.props.size[0]} height={this.props.size[1]}>
                         <g>
                            <line
                                x1 = {0}
                                x2 = {this.props.size[0]}
                                y1 = {this.props.size[1]/2}
                                y2 = {this.props.size[1]/2}
                                strokeWidth = {1}
                                stroke = {'#bdbdbd'}
                            />
                        </g>
                        <g
                            transform = {'translate(' + this.state.resultsData.d3Data.margin.left + ',0)'}
                        >
                        {items.map(
                            (item) => {
                                let d3Data = this.state.resultsData.d3Data
                                return (
                                <TranscriptionRect
                                    height = {this.props.size[1]}
                                    width = {d3Data.scaleX(item.end) - d3Data.scaleX(item.start)}
                                    transform = {'translate(' + d3Data.scaleX(item.start) + ',0)'}
                                    fill = 'black'
                                    key = {JSON.stringify(item)}
                                    data = {JSON.stringify(item)}
                                    onMouseEnter = { (e) => {this.handleMouseOver(e)} }
                                    onMouseLeave = {this.handleMouseOut}
                                    
                                />
                        )})}
                        </g>
                </Svg>
            </div>
        );
    }
}

export default TranscriptPlot;