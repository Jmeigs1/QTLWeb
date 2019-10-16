import React, { Component, useState } from 'react'
import styled from 'styled-components'
import animateScrollTo from 'animated-scroll-to';

import {Axis,axisPropsFromTickScale, LEFT, BOTTOM} from 'react-d3-axis'

import Colors from './UI/Colors'
import {LinkDiv} from './UI/BasicElements'

import './UI/closeButton.css'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
`

class ScatterPlot extends Component{

    constructor(props){
        super(props)
    }

    state = {
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    shouldComponentUpdate(prevProps){
        return(prevProps.filteredData != this.props.filteredData)
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
                    setScroll={this.props.setScroll}
                    filterResultsFunc={this.props.filterResultsFunc}                    
                    filteredData={this.props.filteredData} />
            </div>
        )
    }
}

const Plot = (props) => {

    const [state, setState] = useState({
        toolTipData: null,
        selected: null,
    })

    const scrollToTable = (index) => {

        const body = document.getElementById('table-root')
        const row = document.getElementById(`row_${index}`)
        
        animateScrollTo(body.offsetTop,{
            minDuration: 1000,
        })
        
        row.parentNode.parentNode.parentNode.scrollTop = row.offsetTop - 45
        row.classList.remove('greenFade')
        //DOM trick to retrigger animation
        row.offsetWidth
        row.classList.add('greenFade')
    }

    const handleMouseClick = (event, itemData, coordX, coordY) => {

        let circle = event.target

        if(circle == state.selected){
            setState({
                toolTipData: null,
                selected: null,
            })
            return
        }

        let circleData = itemData
        circleData.coordX = coordX
        circleData.coordY = coordY

        setState({
            toolTipData: circleData,
            selected: circle,
        })
        
        //Brings svg element to front
        circle.parentNode.append(circle)
    }

    const margin = props.d3Data.margin,
    width = props.d3Data.width,
    height = props.d3Data.height

    const x = props.d3Data.scaleX
    const y = props.d3Data.scaleY

    let mainGene = [],
    otherGene = []

    const getToolTipDirection = (coorY,boxHeight) => {
        
        if(coorY < height/2){
            return coorY + 20
        }
        else{
            return coorY - boxHeight - 20
        }

    }

    for( let item of props.filteredData ){
        if(item.NonIndexedData.GeneSymbol == props.geneSymbol){
            mainGene.push(item)
        } else {
            otherGene.push(item)
        }
    }

    return (
        <div style={{position:"relative",width:`${width + margin.left + margin.right}px`,margin:"10px auto"}}>
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

                    <g>
                    {
                        otherGene.map(
                            (item, index) => (
                                <Circle 
                                    cx = {x(item.Site)}
                                    cy = {y(item.NonIndexedData.log10pvalue)}
                                    r = "5"
                                    fill = {Colors[0][0]}
                                    style = {{cursor:"pointer"}}
                                    onClick = {handleMouseClick}
                                    data={item}
                                    key = {item.index}/>
                            )
                        )
                    }
                    {
                        mainGene.map(
                            (item) => (
                                <Circle 
                                    cx = {x(item.Site)}
                                    cy = {y(item.NonIndexedData.log10pvalue)}
                                    r = "5"
                                    fill = "brown"
                                    style = {{cursor:"pointer"}}
                                    onClick = {handleMouseClick}
                                    data={item}
                                    key = {item.index}/> 
                            )
                        )
                    }
                    </g>
                </g>
            </Svg>
                {
                    state.toolTipData ? (
                        <div style={{
                            backgroundColor:"white",
                            boxShadow:"0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)",
                            display:"inline-block",
                            width:"250px",
                            padding:"6px 10px",
                            position:"absolute",
                            left:`${state.toolTipData.coordX + margin.left}px`,
                            top:`${getToolTipDirection(state.toolTipData.coordY,144) + margin.top}px`
                        }}>
                            <div href="#" onClick={() => {setState({toolTipData: null,selected: null})}} className="boxclose">x</div>
                            <div>
                                {state.toolTipData.NonIndexedData.GeneSymbol} -
                                <LinkDiv onClick={() => {props.filterResultsFunc(state.toolTipData.NonIndexedData.GeneSymbol)}} style={{display:"inline"}}>
                                    {' Filter'}
                                </LinkDiv>
                            </div>
                            <div>
                                {state.toolTipData.Coordinate}
                            </div>
                            <div>
                                {state.toolTipData.BystroData["gnomad.genomes.id"]}
                            </div>
                            <hr style={{marginTop:"3px",marginBottom:"3px",borderTopColor:"#4C688B"}}/>
                            <div>
                                {`Value: ${state.toolTipData.NonIndexedData.log10pvalue}`}
                            </div>
                            <LinkDiv onClick={() => {scrollToTable(state.toolTipData.index)}}>
                                Show in table
                            </LinkDiv>
                        </div>
                    ) :
                    ""
                }
        </div>
    )
}

const Circle = (props) => {

    const {data,r,onClick,...otherProps} = props
    const [state, setState] = React.useState({
        radius: props.r,
    })

    const handleMouseClick = (event) => {
        props.onClick(event,props.data,props.cx,props.cy)
    }

    const handleMouseOver = (event) => {
        setState((prevState) => {
            return {
                ...prevState,
                radius: 10,
            }
        })
    }

    const handleMouseOut = (event) => {
        setState((prevState) => {
            return {
                ...prevState,
                radius: 5,
            }
        })
    }

    return (
        <circle 
            {...otherProps}
            onClick={handleMouseClick}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            r={state.radius}
            /> 
    )
}

export default ScatterPlot