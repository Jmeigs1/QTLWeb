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
            hoveredGene: null,
        }
        this.sortedPoints = [] // not in state, don't update when changed!

        this.hoverGene = this.hoverGene.bind(this)
        this.unhoverGene = this.unhoverGene.bind(this)
        this.comparePoints = this.comparePoints.bind(this)
    }

    comparePoints(a, b) {
        // full sort evaluates at ~6ms
        const currentGene = this.props.window.gene

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

    // isRangeOverlapping(startA, endA, startB, endB) {
    //     let expSize = (startA - endA) + (startB - endB)
    //     let actSize = Math.max(startA, endA, startB, endB) - Math.min(startA, endA, startB, endB)
    //     return expSize < actSize
    // }

    getPointFill(d) {
        let isDominantDataset = (d.dataset === 'pqtlOverlap' || d.dataset === 'pqtl')
        if (this.props.window.gene === d.gene) {
            if (isDominantDataset) return '#5e94eb'
            return '#1c4587'
        }
        if (isDominantDataset) return '#d52e2e'
        return '#780000'
    }

    hoverGene(e) {
        const gene = e.target.getAttribute('genename')
        this.setState({
            hoveredGene: gene,
        })
    }
    unhoverGene() {
        this.setState({
            hoveredGene: null,
        })
    }

    render() {
        const { header, window, points, genes } = this.props

        if (this.sortedPoints.length !== points.length) // only re-sort when actual points change
            this.sortedPoints = points.sort(this.comparePoints)

        return (
            <div style={{ clear: "both" }}>
                <h2>
                    {header}
                </h2>
                <div style={{ background: 'translucent', position: "relative", width: `${window.width}px`, margin: "30px auto" }}>
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
                            <g className="ScatterPlot__regions">
                                {genes.map((gene, index) => {
                                    let start = Math.max(window.xScale(gene.start), window.axisPadding.left) // cut off overflow
                                    return (
                                        <g key={index} className={`Scatter__region__${gene.name}`}>
                                            <rect
                                                x={start}
                                                width={window.xScale(gene.end) - start}
                                                y={window.axisPadding.top}
                                                height={window.height - window.axisPadding.top} // ded9d0
                                                fill={window.gene === gene.name ? '#d4e4ff' : '#f3c6c6'}
                                            // style={{ opacity: (!this.state.hoveredGene || this.state.hoveredGene === gene.name ? 1 : .6) }}
                                            />
                                            <rect
                                                x={start}
                                                width={window.xScale(gene.end) - start}
                                                y={window.height - 40}
                                                height={40}
                                                fill={'#333'}
                                                style={{ cursor: "pointer" }}
                                                genename={gene.name}
                                                onMouseEnter={this.hoverGene}
                                                onMouseLeave={this.unhoverGene}
                                            />
                                        </g>
                                    )
                                })}
                                <rect
                                    x={window.axisPadding.left}
                                    width={window.width - window.axisPadding.left}
                                    y={window.height - 40}
                                    height={7}
                                    fill={'#333'}
                                />
                            </g>

                            {/* Points */}
                            <g className="ScatterPlot__points">
                                {this.sortedPoints.map((item, index) => (
                                    <circle
                                        key={index}
                                        className={`ScatterPlot__points__${item.gene} ScatterPlot__points__${item.dataset}`}
                                        cx={window.xScale(item.position)}
                                        cy={window.yScale(item.pvalue)}
                                        r={(!this.state.hoveredGene || this.state.hoveredGene === item.gene) ? 5 : 3}
                                        fill={this.getPointFill(item)}
                                        style={{ cursor: "pointer", opacity: (!this.state.hoveredGene || this.state.hoveredGene === item.gene ? 1 : .2) }}
                                        // onClick={handleMouseClick}
                                        genename={item.gene}
                                        onMouseEnter={this.hoverGene}
                                        onMouseLeave={this.unhoverGene}
                                    />
                                ))}
                            </g>

                            {/* Axis */}
                            <g transform={`translate(0, ${window.axisPadding.top})`} >
                                <Axis {...axisPropsFromTickScale(window.xScale)}
                                    style={{
                                        orient: TOP,
                                    }}
                                />
                            </g>
                            <g transform={`translate(${window.axisPadding.left}, 0)`}>
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