import React, { Component } from 'react'
import styled from 'styled-components'
import animateScrollTo from 'animated-scroll-to'

import { Axis, axisPropsFromTickScale, LEFT, TOP } from 'react-d3-axis'

// import Colors from './UI/Colors'
import { LinkDiv } from './UI/BasicElements'

import './UI/closeButton.css'
import { fontWeight } from '@material-ui/system'

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
`
/*
    TODO:
    make filter work
    make text on geneTrack readable when small
*/

class ScatterPlot extends Component {

    constructor(props) {
        super(props)
        this.state = {
            hoveredGene: null, // covers other
            // filteredGene: null,
            toolTipData: null,
            selected: -1,
        }
        this.sortedPoints = [] // not in state, don't update when changed!

        this.filterGene = this.filterGene.bind(this)
        this.hoverGene = this.hoverGene.bind(this)
        this.unhoverGene = this.unhoverGene.bind(this)
        this.comparePoints = this.comparePoints.bind(this)
        this.showToolTip = this.showToolTip.bind(this)
        this.scrollTable = this.scrollTable.bind(this)
    }

    formGeneTracks(genes) {
        let distributed = [[]]
        genes.map(gene => {
            // if we can place it in existing genes... gene
            if (distributed.some(geneTrack => {
                // if none are overlapping
                if (geneTrack.some(this.areRegionsOverlapping.bind(this, gene)))
                    return false
                geneTrack.push(gene)
                return true
            })) return true
            // if we can't place it...
            distributed.push([gene])
            return false
        })
        return distributed
    }

    areRegionsOverlapping(a, b) {
        let actualDif = Math.max(a.end, b.end) - Math.min(a.start, b.start)
        let minDif = (a.end - a.start) + (b.end - b.start)
        // if (actualDif < minDif) console.log(`OVERLAP between: ${a.name} :: ${b.name}`)
        return (actualDif < minDif)
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

    filterGene(e) { // call with event or gene
        let gene = e
        if (e.target)
            gene = e.target.getAttribute('genename')
        if (this.props.filterGene === gene) gene = ''

        // this.setState({ filteredGene: gene })
        this.props.filterResults(gene)
    }

    getPointFill(d) {
        let isDominantDataset = (d.dataset === 'pqtlOverlap' || d.dataset === 'pqtl')
        if (this.props.window.gene === d.gene) {
            if (isDominantDataset) return '#5e94eb'
            return '#1c4587'
        }
        if (isDominantDataset) return '#d52e2e'
        return '#780000'
    }

    getToolTipDirection(coorY, boxHeight) {
        if (coorY < this.props.window.height / 2)
            return coorY + 20
        return coorY - boxHeight - 20
    }

    hoverGene(e) {
        // if (this.props.filterGene) return
        const gene = e.target.getAttribute('genename')
        this.setState({ hoveredGene: gene })
    }
    unhoverGene() {
        this.setState({
            hoveredGene: null,
        })
    }

    showToolTip(e) {
        let circle = e.target
        let circleIndex = circle.getAttribute('index')

        if (this.state.selected == circleIndex)
            return this.setState({
                toolTipData: null,
                selected: -1,
            })

        let toolTipData = {
            ...this.sortedPoints[circleIndex],
            coordX: circle.getAttribute('cx'),
            coordY: circle.getAttribute('cy'),
        }
        this.setState({
            toolTipData,
            selected: circleIndex,
        })
    }

    scrollTable(e) {
        let point = this.sortedPoints[this.state.selected]

        let index = point.index // index in unsorted list

        this.props.genePageTableRef.current.setState({ "highlightIndex": index })
        this.props.genePageTableRef.current._table.current.scrollToRow(index)

        const body = document.getElementById('table-root')

        animateScrollTo(body.offsetTop, {
            minDuration: 1000,
        })
    }

    render() {
        const { header, window, points, genes } = this.props

        const geneTracks = this.formGeneTracks(genes) // TODO: don't do on every update

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
                        height={window.height + 40 * geneTracks.length}>
                        <g>

                            {/* Labels */}
                            <g className="ScatterPlot__labels">
                                <text
                                    transform={`translate(${window.width / 2}, 12)`}
                                    style={{ textAnchor: "middle" }}
                                >
                                    Genomic Position
                                </text>
                                <text
                                    transform="rotate(-90)"
                                    style={{ textAnchor: "middle" }}
                                    dy="1em"
                                    x={0 - (window.height / 2)}
                                >
                                    Log 10 P-Value
                                </text>
                            </g>

                            {/* Shaded Regions */}
                            <g className="ScatterPlot__tracks">
                                <rect
                                    x={window.axisPadding.left}
                                    width={window.width - window.axisPadding.left}
                                    y={window.height}
                                    height={7}
                                    fill='#333'
                                />
                                {geneTracks.map((track, trackIndex) => (
                                    <g
                                        key={trackIndex}
                                        className="ScatterPlot__tracks__track"
                                    >
                                        {track.map((gene, index) => {
                                            let start = Math.max(window.xScale(gene.start), window.axisPadding.left) // cut off overflow
                                            return (
                                                <g key={index} className={`Scatter__region__${gene.name}`}>
                                                    <rect
                                                        x={start}
                                                        width={window.xScale(gene.end) - start}
                                                        y={window.axisPadding.top}
                                                        height={window.height - window.axisPadding.top} // ded9d0
                                                        fill={window.gene === gene.name ? '#d4e4ff' : '#f0f0f0'}
                                                    />
                                                    <rect
                                                        x={start}
                                                        width={window.xScale(gene.end) - start}
                                                        y={window.height + 40 * trackIndex}
                                                        height={38}
                                                        fill='#333'
                                                        style={{ cursor: 'pointer' }}
                                                        genename={gene.name}
                                                        onMouseEnter={this.hoverGene}
                                                        onMouseLeave={this.unhoverGene}
                                                        onClick={this.filterGene}
                                                    />
                                                    <text
                                                        x={start + (window.xScale(gene.end) - start) / 2}
                                                        y={window.height + 25 + 40 * trackIndex}
                                                        style={{ textAnchor: 'middle', pointerEvents: 'none', fontWeight: ((gene.name === this.props.filterGene) ? 'bold' : 'normal') }}
                                                        fill='white'
                                                    >
                                                        {gene.name}
                                                    </text>
                                                </g>
                                            )
                                        })}
                                    </g>
                                ))}
                            </g>

                            {/* Points */}
                            <g className="ScatterPlot__points">
                                {this.sortedPoints.map((item, index) => (
                                    <circle
                                        key={index}
                                        index={index}
                                        className={`ScatterPlot__points__${item.gene} ScatterPlot__points__${item.dataset}`}
                                        cx={window.xScale(item.position)}
                                        cy={window.yScale(item.log10pvalue)}
                                        r={(!this.state.hoveredGene || this.state.hoveredGene === item.gene) ? 5 : 3}
                                        fill={this.getPointFill(item)}
                                        style={{ cursor: "pointer", opacity: (!this.state.hoveredGene || this.state.hoveredGene === item.gene ? 1 : .15) }}

                                        genename={item.gene}
                                        onMouseEnter={this.hoverGene}
                                        onMouseLeave={this.unhoverGene}
                                        onClick={this.showToolTip}
                                    />
                                ))}
                            </g>

                            {/* Axis */}
                            <g className="ScatterPlot__axis">
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

                        </g>
                    </Svg>
                    {/* Tooltip */}
                    {(this.state.toolTipData) ? (
                        <div style={{
                            backgroundColor: "white",
                            boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)",
                            display: "inline-block",
                            width: "250px",
                            padding: "6px 10px",
                            position: "absolute",
                            left: `${this.state.toolTipData.coordX + window.padding.left}px`,
                            // top: `${this.state.toolTipData.coordY + window.padding.top - 134}px`,
                            top: `${this.getToolTipDirection(this.state.toolTipData.coordY, 134) + window.padding.top}px`,
                        }}>
                            <div href="#" onClick={() => { this.setState({ toolTipData: null, selected: null }) }} className="boxclose">x</div>
                            <div>
                                {this.state.toolTipData.gene} -
                                <LinkDiv
                                    onClick={e => this.filterGene(this.state.toolTipData.gene)}
                                    style={{ display: "inline" }}
                                >Toggle Filter</LinkDiv>
                            </div>
                            <div>
                                {`${this.state.toolTipData.chromosome}:${this.state.toolTipData.position}`}
                            </div>
                            <div>
                                {this.state.toolTipData.bystroId}
                            </div>
                            <hr style={{ marginTop: "3px", marginBottom: "3px", borderTopColor: "#4C688B" }} />
                            <div>
                                {`Value: ${this.state.toolTipData.log10pvalue}`}
                            </div>
                            <LinkDiv onClick={this.scrollTable}>
                                Show in table
                            </LinkDiv>
                        </div>
                    ) : ""}
                </div>
            </div >
        )
    }
}


export default ScatterPlot
