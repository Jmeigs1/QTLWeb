import React, { Component/*, useState*/ } from 'react'
import styled from 'styled-components'
// import animateScrollTo from 'animated-scroll-to'

import { Axis, axisPropsFromTickScale, LEFT, TOP } from 'react-d3-axis'

// import Colors from './UI/Colors'
// import { LinkDiv } from './UI/BasicElements'

import './UI/closeButton.css'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
`

class ScatterPlot extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hoveredGene: props.window.gene,
        }


        this.comparePoints = this.comparePoints.bind(this)
    }

    comparePoints(a, b) {
        // full sort evaluates at ~6ms
        const currentGene = this.state.hoveredGene || this.props.window.gene

        if (currentGene === a.gene) {
            if (currentGene !== b.gene) return 1
        }
        else if (currentGene === b.gene) return -1

        if (a.dataset === 'pqtlOverlap') {
            if (b.dataset !== 'pqtlOverlap') return 1
        }
        else if (b.dataset !== 'pqtlOverlap') return -1

        return 0
    }

    getPointFill(d) {
        if (this.props.window.gene === d.gene) {
            if (d.dataset === 'pqtlOverlap') return '#3c78d8ff'
            return '#1c4587ff'
        }
        if (d.dataset === 'pqtlOverlap') return '#cc0000ff'
        return '#780000ff'
    }

    render() {
        const { header, window, points, genes } = this.props

        let sortedPoints = points.sort(this.comparePoints)

        return (
            <div style={{ clear: "both" }}>
                <h2>
                    {header}
                </h2>
                <div style={{ position: "relative", width: `${window.width}px`, margin: "30px auto" }}>
                    <Svg
                        id="MainGraphArea"
                        width={window.width}
                        height={window.height}>
                        <g>

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

                            {/* Points */}
                            <g className="ScatterPlot__points">
                                {sortedPoints.map((item, index) => (
                                    <circle
                                        cx={window.xScale(item.position)}
                                        cy={window.yScale(item.pvalue)}
                                        r="5"
                                        fill={this.getPointFill(item)}
                                        style={{ cursor: "pointer" }}
                                        // onClick={handleMouseClick}
                                        data={item}
                                        key={index}
                                        className={`ScatterPlot__points__${item.gene} ScatterPlot__points__${item.dataset}`}
                                    />
                                ))}
                            </g>

                            {/*Axis*/}
                            <g transform={`translate(0, 20)`} >
                                <Axis {...axisPropsFromTickScale(window.xScale)}
                                    style={{
                                        orient: TOP,
                                    }}
                                />
                            </g>
                            <g transform={`translate(22, 0)`}>
                                <Axis {...axisPropsFromTickScale(window.yScale)}
                                    style={{
                                        orient: LEFT,
                                    }}
                                />
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
            </div >
        )
    }
}


export default ScatterPlot