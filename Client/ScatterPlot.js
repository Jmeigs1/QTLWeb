import React, { Component } from 'react'
import styled from 'styled-components'

import {Axis,axisPropsFromTickScale, LEFT, BOTTOM} from 'react-d3-axis'

import Colors from './UI/Colors'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
`

class ScatterPlot extends Component{

    constructor(props){
        super(props)
    }

    state = {
        dataLoaded: false
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    shouldComponentUpdate(prevProps){
        return( 
            prevProps.filteredData != this.props.filteredData)
    }

    render() {
        return (
            <div style={{clear:"both"}}>
                <h2>
                    {this.props.header}
                </h2>
                <Plot 
                    size={this.props.size}
                    d3Data={this.props.d3Data}
                    range={this.props.range}
                    geneSymbol={this.props.geneSymbol}
                    dataLoaded={this.props.geneDataLoaded}
                    filteredData={this.props.filteredData} />
            </div>
        )
    }
}

const Plot = (props) => {

    const handleMouseOver = (event) => {
        let circle = event.target
        circle.setAttribute('r','10')

        //Brings svg element to front
        circle.parentNode.append(circle)
    }

    const handleMouseOut = (event) => {
        event.target.setAttribute('r','5')
    }

    const margin = props.d3Data.margin,
    width = props.d3Data.width,
    height = props.d3Data.height

    const x = props.d3Data.scaleX
    const y = props.d3Data.scaleY

    let mainGene = [],
    otherGene = []

    for( let item of props.filteredData ){
        if(item.NonIndexedData.GeneSymbol == props.geneSymbol){
            mainGene.push(item)
        } else {
            otherGene.push(item)
        }
    }

    return (
    <Svg 
        id="MainGraphArea"
        width = {width + margin.left + margin.right}
        height = {height + margin.top + margin.bottom}>
        <g transform = {"translate(" + margin.left + "," + margin.top + ")"}>
            {/*Axis*/}
            <g transform= {"translate(0," + height + ")"}>
                <Axis {...axisPropsFromTickScale(props.d3Data.scaleX)} 
                    style={{
                        orient: BOTTOM,
                    }}
                />
             </g>
             <g>
                <Axis {...axisPropsFromTickScale(props.d3Data.scaleY)} 
                    style={{
                        orient: LEFT,
                    }}
                />
             </g>
            {/*Label*/}
            <text
                transform = {"translate(" + (width/2) + " ," + (height + margin.top + 30) + ")"}
                style = {{textAnchor:"middle"}}
                >
                    Genomic Position
            </text>
            <text
                transform = "rotate(-90)"
                style = {{textAnchor:"middle"}}
                dy = "1em"
                y = {0 - margin.left}
                x = {0 - (height / 2)}
                >
                    -Log 10 P-Value
            </text>
            {/*Shaded Regions*/}        
            <rect
                width = {x(props.range.end)-x(props.range.start)}
                height = {height}
                fill = {Colors[1][0]}
                fillOpacity = {0.6}
                transform = {'translate(' + x(props.range.start) +',0)'}
                />
            <rect
                width = {x(props.range.start) - x(Math.max(props.range.start - props.range.padding,0))}
                height = {height}
                fill = {"#AA9239"}
                fillOpacity = {0.1}
                transform = {'translate(' + x(Math.max(props.range.start - props.range.padding,0)) + ',0)'}/>    
            <rect
                width = {x(props.range.start) - x(props.range.start - props.range.padding)}
                height = {height}
                fill = {"#AA9239"}
                fillOpacity = {0.1}
                transform = {'translate(' + x(props.range.end) + ',0)'}/>

            {
                otherGene.map(
                    (item, index) => (
                        <circle 
                            cx = {x(item.Site)}
                            cy = {y(item.NonIndexedData.log10pvalue)}
                            r = "5"
                            fill = {Colors[0][0]}
                            style = {{cursor:"pointer"}}
                            onMouseOver = {handleMouseOver}
                            onMouseOut = {handleMouseOut}
                            key = {index}/>
                    )
                )
            }
            {
                mainGene.map(
                    (item, index) => (
                        <circle 
                            cx = {x(item.Site)}
                            cy = {y(item.NonIndexedData.log10pvalue)}
                            r = "5"
                            fill = "brown"
                            style = {{cursor:"pointer"}}
                            onMouseOver = {handleMouseOver}
                            onMouseOut = {handleMouseOut}
                            key = {index}/>
                    )
                )
            }
        </g>
    </Svg>
)}

export default ScatterPlot;