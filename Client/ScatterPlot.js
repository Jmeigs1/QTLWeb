import React, { Component } from 'react'
import styled from 'styled-components'

import * as d3 from 'd3'
import {Axis,axisPropsFromTickScale, LEFT, BOTTOM} from 'react-d3-axis'

import Colors from './UI/Colors'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
`

const LegendDiv = styled.div`
    width: 1000px;
    margin: auto;
    display: block;
    height: 25px;
    line-height:25px;
`

const LegendIconSquare = styled.span`
    height: 25px;
    width: 25px;
    display: inline-block;
    border: 1px solid black;
`

const LegendIconCircle = styled(LegendIconSquare)`
    border-radius: 50%;
    height: 10px;
    width: 10px;
    vertical-align: super;
`

const LegendLabel = styled.span`
    vertical-align: top;
    display: inline-block;
    margin: 0 10px;
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

    render() {
        return (
            <div>
                <Plot 
                    size={this.props.size}
                    d3Data={this.props.d3Data}
                    range={this.props.range}
                    geneSymbol={this.props.geneSymbol}
                    dataLoaded={this.props.geneDataLoaded}
                    filteredData={this.props.filteredData} />
                <p>
                    Legend
                </p>
                <LegendDiv>
                        <LegendIconSquare style={{
                            background: '#3A32769A',
                        }}/> 
                        <LegendLabel>Searched Gene Coding Region</LegendLabel>
                        <LegendIconSquare style={{
                            background: '#AA92391A',
                        }}/> 
                        <LegendLabel>Window Region</LegendLabel>
                        <LegendIconCircle style={{
                            background: 'brown',
                        }}/>
                        <LegendLabel>Searched Gene QTL</LegendLabel>
                        <LegendIconCircle style={{
                            background: '#2B4970',
                        }}/>
                        <LegendLabel>In Window QTL</LegendLabel>
                </LegendDiv>
                <p>
                </p>
            </div>
        )
    }
}

const Plot = (props) => {

    const handleMouseOver = (event) => {

        event.target.setAttribute('r','10')

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
        if(item.NonIndexedData.EnsemblGeneID == props.geneSymbol){
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
                            cy = {y(item.NonIndexedData.Log10pvalue)}
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
                            cy = {y(item.NonIndexedData.Log10pvalue)}
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