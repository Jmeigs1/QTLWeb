import React, { Component, useState } from 'react'
import styled from 'styled-components'
// import animateScrollTo from 'animated-scroll-to'

import { Axis, axisPropsFromTickScale, LEFT, TOP } from 'react-d3-axis'

import Colors from './UI/Colors'
// import { LinkDiv } from './UI/BasicElements'

import './UI/closeButton.css'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
`

class ScatterPlot extends Component {

    componentDidMount() {
        console.log('ScatterPlot.componentDidMount')
    }

    componentDidUpdate() {

    }

    // shouldComponentUpdate(prevProps){
    //     return(prevProps.filteredData != this.props.filteredData)
    // }

    render() {
        console.log(this.props)
        return (
            <div style={{ clear: "both" }}>
                <h2>
                    {this.props.header}
                </h2>
                <Plot
                    // size={this.props.size}
                    d3Data={this.props.d3Data}
                // range={this.props.range}
                // geneSymbol={this.props.geneSymbol}
                // genePageTableRef={this.props.genePageTableRef}
                // setScroll={this.props.setScroll}
                // filterResultsFunc={this.props.filterResultsFunc}
                // filteredData={this.props.filteredData}
                />
            </div>
        )
    }
}

const Plot = (props) => {

    const { points, window, genes } = props.d3Data

    // const [state, setState] = useState({
    //     toolTipData: null,
    //     selected: null,
    // })

    // const scrollToTable = (index) => {

    //     window.test = props.genePageTableRef.current

    //     props.genePageTableRef.current.setState({ "highlightIndex": index })

    //     props.genePageTableRef.current._table.current.scrollToRow(index)

    //     const body = document.getElementById('table-root')

    //     animateScrollTo(body.offsetTop, {
    //         minDuration: 1000,
    //     })
    // }

    // const handleMouseClick = (event, itemData, coordX, coordY) => {

    //     let circle = event.target

    //     if (circle == state.selected) {
    //         setState({
    //             toolTipData: null,
    //             selected: null,
    //         })
    //         return
    //     }

    //     let circleData = itemData
    //     circleData.coordX = coordX
    //     circleData.coordY = coordY

    //     setState({
    //         toolTipData: circleData,
    //         selected: circle,
    //     })

    //     //Brings svg element to front
    //     circle.parentNode.append(circle)
    // }

    // const margin = props.d3Data.margin,
    //     width = props.d3Data.width,
    //     height = props.d3Data.height

    // const x = props.d3Data.scaleX
    // const y = props.d3Data.scaleY



    // const getToolTipDirection = (coorY, boxHeight) => {

    //     if (coorY < height / 2) {
    //         return coorY + 20
    //     }
    //     else {
    //         return coorY - boxHeight - 20
    //     }

    // }

    const getPointFill = d => {
        if (window.gene === d.gene) {
            if (d.dataset === 'pqtlOverlap') return '#3c78d8ff'
            return '#1c4587ff'
        }
        if (d.dataset === 'pqtlOverlap') return '#cc0000ff'
        return '#780000ff'
    }


    return (
        <div style={{ position: "relative", width: `${window.width + window.padding.left + window.padding.right}px`, margin: "30px auto" }}>
            <Svg
                id="MainGraphArea"
                width={window.width}
                height={window.height}>
                <g>
                    {/*Axis*/}
                    <g transform={`translate(0, ${window.padding.top})`} >
                        <Axis {...axisPropsFromTickScale(window.xScale)}
                            style={{
                                orient: TOP,
                            }}
                        />
                    </g>
                    <g transform={`translate(${window.padding.left}, 0)`}>
                        <Axis {...axisPropsFromTickScale(window.yScale)}
                            style={{
                                orient: LEFT,
                            }}
                        />
                    </g>
                    {/*Label*/}
                    {/* <text
                        transform={"translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")"}
                        style={{ textAnchor: "middle" }}
                    >
                        Genomic Position
                    </text>
                    <text
                        transform="rotate(-90)"
                        style={{ textAnchor: "middle" }}
                        dy="1em"
                        y={0 - margin.left}
                        x={0 - (height / 2)}
                    >
                        -Log 10 P-Value
                    </text> */}
                    {/*Shaded Regions*/}


                    <g className="ScatterPlot__points">
                        {points.map((item, index) => (
                            <circle
                                cx={window.xScale(item.position)}
                                cy={window.yScale(item.pvalue)}
                                r="5"
                                fill={getPointFill(item)}
                                style={{ cursor: "pointer" }}
                                // onClick={handleMouseClick}
                                data={item}
                                key={index}
                                className={`ScatterPlot__points__${item.gene} ScatterPlot__points__${item.dataset}`}
                            />
                        ))}
                    </g>
                </g>
            </Svg>
            {/*state.toolTipData ? (
                <div style={{
                    backgroundColor: "white",
                    boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)",
                    display: "inline-block",
                    width: "250px",
                    padding: "6px 10px",
                    position: "absolute",
                    left: `${state.toolTipData.coordX + margin.left}px`,
                    top: `${getToolTipDirection(state.toolTipData.coordY, 144) + margin.top}px`,
                }}>
                    <div href="#" onClick={() => { setState({ toolTipData: null, selected: null }) }} className="boxclose">x</div>
                    <div>
                        {state.toolTipData.NonIndexedData.GeneSymbol} -
                        <LinkDiv onClick={() => { props.filterResultsFunc(state.toolTipData.NonIndexedData.GeneSymbol) }} style={{ display: "inline" }}>
                            {' Filter'}
                        </LinkDiv>
                    </div>
                    <div>
                        {state.toolTipData.Coordinate}
                    </div>
                    <div>
                        {state.toolTipData.BystroData["gnomad.genomes.id"]}
                    </div>
                    <hr style={{ marginTop: "3px", marginBottom: "3px", borderTopColor: "#4C688B" }} />
                    <div>
                        {`Value: ${state.toolTipData.NonIndexedData.log10pvalue}`}
                    </div>
                    <LinkDiv onClick={() => { scrollToTable(state.toolTipData.filterdIndex) }}>
                        Show in table
                    </LinkDiv>
                </div>
            ) : ""*/}
        </div>
    )
}

const Circle = (props) => {
    console.log('Circle');

    const { data, r, onClick, ...otherProps } = props
    const [state, setState] = React.useState({
        radius: props.r,
    })

    // const handleMouseClick = (event) => {
    //     props.onClick(event, props.data, props.cx, props.cy)
    // }

    // const handleMouseOver = (event) => {
    //     setState((prevState) => {
    //         return {
    //             ...prevState,
    //             radius: 10,
    //         }
    //     })
    // }

    // const handleMouseOut = (event) => {
    //     setState((prevState) => {
    //         return {
    //             ...prevState,
    //             radius: 5,
    //         }
    //     })
    // }

    return (
        <circle
            {...otherProps}
        // onClick={handleMouseClick}
        // onMouseOver={handleMouseOver}
        // onMouseOut={handleMouseOut}
        />
    )
}

export default ScatterPlot