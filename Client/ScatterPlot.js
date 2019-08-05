import React, { Component } from 'react'
import styled from 'styled-components'

import * as d3 from "d3"

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
        this.createScatterPlot = this.createScatterPlot.bind(this)
    }

    state = {
        dataLoaded: false
    }

    componentDidMount() {
        this.createScatterPlot()
    }

    componentDidUpdate() {
        this.createScatterPlot()
    }

    handleMouseOver(data, index, objects) {

        let dot = objects[index]
        dot.setAttribute('r','10')
    }

    handleMouseOut(data, index, objects) {

        let dot = objects[index]
        dot.setAttribute('r','5')        
    }

    createScatterPlot(){
        if (!this.props.dataLoaded) {
            return
        }

        const node = this.node

        const margin = this.props.d3Data.margin,
        width = this.props.d3Data.width,
        height = this.props.d3Data.height

        d3.select(node).html("")

        // append the svg object to the body of the page
        var sVg = d3.select(node)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // X scale and Axis
        var x = this.props.d3Data.scaleX
        
        sVg
        .append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("s")))

        sVg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")

        // Y scale and Axis
        var y = this.props.d3Data.scaleY

        sVg
        .append('g')
        .call(d3.axisLeft(y))

        // text label for the x axis
        sVg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Genomic Position")

        sVg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("-Log 10 P-Value"); 

        var colunmWidth = x(this.props.range.end)-x(this.props.range.start)

        sVg.append("rect")
            .attr("width", colunmWidth)
            .attr("height", height)
            .attr("fill", Colors[1][0])
            .attr("fill-opacity", "0.6")
            .attr('transform','translate(' + x(this.props.range.start) +',0)')

        let colunmWidthLeft =  x(this.props.range.start) - x(Math.max(this.props.range.start - this.props.range.padding,0)), 
        colunmWidthRight =  x(this.props.range.start) - x(this.props.range.start - this.props.range.padding) 

        sVg.append("rect")
            .attr("width", colunmWidthLeft)
            .attr("height", height)
            .attr("fill", '#AA9239')
            .attr("fill-opacity", "0.1")
            .attr('transform','translate(' + x(Math.max(this.props.range.start - this.props.range.padding,0)) +',0)')

        sVg.append("rect")
            .attr("width", colunmWidthRight)
            .attr("height", height)
            .attr("fill", '#AA9239')
            .attr("fill-opacity", "0.1")
            .attr('transform','translate(' + x(this.props.range.end) +',0)')

        //Data circles
        sVg
            .selectAll('circle')
            .data(this.props.filteredData)
            .enter()
            .filter(function(x){return x.gene != "ENSG00000171163"})
            .append("circle")
                .attr("cx", function(d){ return x(d.pos) })
                .attr("cy", function(d){ return y(d.pVal) })
                .attr("r", 5)
                .attr("fill", Colors[0][0])
                .on("mouseover", this.handleMouseOver)
                .on("mouseout", this.handleMouseOut)
                .style("cursor", "pointer")

        sVg
            .selectAll('circle2')
            .data(this.props.filteredData)
            .enter()
            .filter(function(x){return x.gene == "ENSG00000171163"})
            .append("circle")
                .attr("cx", function(d){ return x(d.pos) })
                .attr("cy", function(d){ return y(d.pVal) })
                .attr("r", 5)
                .attr("fill", 'brown')
                .on("mouseover", this.handleMouseOver)
                .on("mouseout", this.handleMouseOut)
                .style("cursor", "pointer")

    }

    render() {
        return (
            <div>
                <Svg id="MainGraphArea" ref={node => this.node = node}
                    width={this.props.size[0]} height={this.props.size[1]}>
                </Svg>
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


export default ScatterPlot;