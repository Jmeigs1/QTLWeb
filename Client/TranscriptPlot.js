import React, { Component } from 'react';
import styled from 'styled-components'

import Colors from './UI/Colors'

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
    }

    state = {
        resultsData: {
            geneName: ''
        }
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        
    }

    shouldComponentUpdate(nextProps, nextState){
         return (nextProps.geneData != this.props.geneData)
    }

    handleMouseOver(event) {

        let rect = event.target
        rect.setAttribute('fill',Colors[2][0])
    }

    handleMouseOut(event) {

        let rect = event.target
        rect.setAttribute('fill','black')    
    }

    render() {
        let items = []
        if(this.props.geneData){
            for(let gene in this.props.geneData){
                // let starts = Buffer.from( this.props.geneData[gene]["ensGene.txStart"],'utf-8' ).toString()
                let start = this.props.geneData[gene]["ensGene.txStart"]
                // let ends = Buffer.from( this.props.geneData[gene]["ensGene.txEnd"],'utf-8' ).toString()
                let end = this.props.geneData[gene]["ensGene.txEnd"]
                let name = this.props.geneData[gene]["knownXref.GeneSymbol"]
                let ensID = this.props.geneData[gene]["ensGene.GeneID"]

                items.push({
                    name: name,
                    start: start,
                    end: end,
                    ensID: ensID
                })
            }
        }
        
        if(!this.props.d3Data)
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
                            transform = {'translate(' + this.props.d3Data.margin.left + ',0)'}
                        >
                        {items.map(
                            (item) => {
                                let d3Data = this.props.d3Data
                                return (
                                <TranscriptionRect
                                    height = {this.props.size[1]}
                                    width = {d3Data.scaleX(item.end) - d3Data.scaleX(item.start)}
                                    transform = {'translate(' + d3Data.scaleX(item.start) + ',0)'}
                                    fill = 'black'
                                    key = {item.ensID}
                                    data = {JSON.stringify(item)}
                                    value={item.ensID}
                                    onMouseEnter = { (e) => {this.handleMouseOver(e)} }
                                    onMouseLeave = {this.handleMouseOut}
                                    onClick={(e) => {this.props.filterResultsFunc(e.target.getAttribute("value"))}}
                                    
                                />
                        )})}
                        </g>
                </Svg>
            </div>
        );
    }
}

export default TranscriptPlot;