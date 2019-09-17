import React, { Component } from 'react'
import styled from 'styled-components'

import {Axis,axisPropsFromTickScale, BOTTOM} from 'react-d3-axis'

import Colors from './UI/Colors'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
    cursor: pointer;
`

const TranscriptionRect = styled.rect`
    cursor: pointer;
`

const ArrowBox = styled.div`

    background-color: #4C688B;
    border-radius: 3px;
    color: white;
    display: inline-block;
    position: relative;
    text-align: center;
    padding: 4px 0;
    width: 100px;
    border: 2px solid #000;

    &::after, &::before {
        top: 100%;
        left: 50%;
        border: solid;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    &::after {
        border-color: rgba(136, 183, 213, 0);
        border-top-color: #4C688B;
        border-width: 10px;
        margin-left: -10px;
    }

    &::before {
        border-color: rgba(136, 183, 213, 0);
        border-top-color: #000;
        border-width: 13px;
        margin-left: -13px;
    }`

const buildTranscriptLayers = (geneData) => {

    //Splits the gene regions into non-overlaping tracks for visualization
 
    let geneDataCopy = geneData.slice(0)
    let retGeneDataArray = []

    while(geneDataCopy.length > 0){
        let geneRow = []

        //Aribrary padding of 100 bp
        let padding = 100

        let index = 0
        geneRow.push(...geneDataCopy.splice(0,1))

        for(var i = 0; i < geneDataCopy.length; i++){
            if((geneRow[index].end + padding) - geneDataCopy[i].start < 0){
                geneRow.push(...geneDataCopy.splice(i,1))
                index++
                i--
            }
        }

        retGeneDataArray.push(geneRow.slice(0))
    }
    return retGeneDataArray
}

class TranscriptPlot extends Component {

    constructor(props){
        super(props)
    }

    state = {
        resultsData: {
            geneName: '',
        },
        toolTipText: '',
        toolTipOffset: 0,
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        
    }

    // shouldComponentUpdate(nextProps, nextState){
        //  return (nextProps.geneData != this.props.geneData)
    // }

    handleMouseOver(event,value,offset) {
        let rect = event.target
        rect.setAttribute('fill',Colors[2][0])
        //Brings svg element to front
        this.setState({
            toolTipText: value,
            toolTipOffset: offset,
        })
    }

    handleMouseOut(event, fillcolor) {
        let rect = event.target
        rect.setAttribute('fill',fillcolor)
        this.setState({
            toolTipText:''
        })
    }

    render() {

        if(!this.props.d3Data){
            return (<div/>)
        }
        
        const margin = this.props.d3Data.margin,
            width = this.props.d3Data.width,
            padding = 5

        let sortedGeneData = this.props.geneData.sort( (a,b) => (a.start - b.start) )
        let layeredGeneData = buildTranscriptLayers(sortedGeneData)

        if(layeredGeneData.length == 0){
            return (
                <div>
                    <p>
                        {this.props.header}
                    </p>
                </div>
            )
        }

        return (
            <div>
                <h3 style={{textAlign:"center"}}>
                    {this.props.header}
                </h3>
                <select
                    size="3"
                    value={sortedGeneData.map(o => o.name).includes(this.props.filterValue) ? this.props.filterValue : '' }
                    onChange={(e) => {
                        this.props.filterResultsFunc(e.target.value)
                        }}>
                    <option value="" disabled hidden>Choose here</option>
                    {sortedGeneData.map(
                        (gene) => (
                            <option value={gene.name} key={gene.name}>{gene.name}</option>
                        )
                    )}
                </select>

                {
                    this.state.toolTipText ? 
                    (
                        <div 
                            style={{
                                height:'32px',
                                margin: '20px auto',
                                width:width,
                            }}>
                                <ArrowBox style={{left:this.state.toolTipOffset - 50}}>
                                    {this.state.toolTipText}
                                </ArrowBox>
                        </div>
                    ) :
                    <div 
                        style={{
                            height:'32px',
                            width:this.props.size[0],
                            margin: '20px auto',
                        }}/>
                }

                {layeredGeneData.map(
                    (geneRow,i) => (
                        <Svg 
                            key={i}
                            id={`TranscriptArea${i}`} 
                            width={this.props.size[0]}
                            height={this.props.size[1]}
                            >
                            <g transform= {`translate(${margin.left},0)`}>                        
                                <line
                                    x1 = {0}
                                    x2 = {width}
                                    y1 = {this.props.size[1]/2}
                                    y2 = {this.props.size[1]/2}
                                    strokeWidth = {1}
                                    stroke = {'black'}
                                />
                            </g>
                            <g width = {width} transform= {`translate(${margin.left},0)`}>
                            {geneRow.map(
                                (item) => {
                                    let d3Data = this.props.d3Data,
                                    fillcolor = this.props.filterValue == item.name ? 'brown' : 'black',
                                    d3Width = d3Data.scaleX(item.end) - d3Data.scaleX(item.start),
                                    start = d3Data.scaleX(item.start),
                                    offset = start + d3Width/2
                                    if(offset > width){
                                        offset = width
                                    }
                                    else if(offset < 0){
                                        offset = 0
                                    }

                                    return (
                                    <TranscriptionRect
                                        height = {this.props.size[1]}
                                        width = {d3Width}
                                        transform = {`translate(${start},0)`}
                                        fill = {fillcolor}
                                        key = {item.name}
                                        data = {JSON.stringify(item)}
                                        value={item.name}
                                        onMouseEnter = {(e) => this.handleMouseOver(e,item.name,offset)}
                                        onMouseLeave = {(e) => this.handleMouseOut(e,fillcolor)}
                                        onClick={(e) => {this.props.filterResultsFunc(e.target.getAttribute("value"))}}
                                        
                                    />
                            )})}
                            </g>
                    </Svg>
                    )
                )}
                <Svg
                    width={this.props.size[0]}
                    height={40}>
                    <g transform= {`translate(${margin.left},0)`}>
                        <Axis {...axisPropsFromTickScale(this.props.d3Data.scaleX)} 
                            style={{
                                orient: BOTTOM,
                            }}
                        />
                    </g>
                </Svg>
            </div>
        )
    }
}

export default TranscriptPlot