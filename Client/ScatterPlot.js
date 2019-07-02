import React, { Component } from 'react';
import styled from 'styled-components'

import * as d3 from "d3"

import * as TestData from './TestData'
import Colors from './UI/Colors'

import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const Svg = styled.svg`
    margin: 10px auto;
    display: block;
`

const UseStyles = styled.div`
    width: 1000px;
    margin: 10px auto;
`

function valuetext(value) {
  return `${value}°C`;
}

export function RangeSlider() {
  const [value, setValue] = React.useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <UseStyles>
      <Typography id="range-slider" gutterBottom>
        BP range
      </Typography>
      <Slider
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </UseStyles>
  );
}

class ScatterPlot extends Component{

    constructor(props){
        super(props)
        this.createScatterPlot = this.createScatterPlot.bind(this)
    }

    state = {
        dataLoaded: false
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate() {
        if(this.props.resultsData.geneName != this.state.geneName){
            this.loadData()
        }
    }

    loadData() {
        if(this.props.resultsData){
            this.setState({
                ...this.props.resultsData
            },
            () => {this.createScatterPlot()})
        }
    }

    createScatterPlot(){
        if (!this.state.dataLoaded) {
            return
        }

        const node = this.node

        const margin = this.state.d3Data.margin,
        width = this.state.d3Data.width,
        height = this.state.d3Data.height

        d3.select(node).html("")

        // append the svg object to the body of the page
        var sVg = d3.select(node)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // X scale and Axis
        var x = this.state.d3Data.scaleX
        
        sVg
        .append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("s")))

        sVg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Position")

        // Y scale and Axis
        var y = this.state.d3Data.scaleY

        sVg
        .append('g')
        .call(d3.axisLeft(y))

        // text label for the x axis
        sVg.append("text")             
        .attr("transform",
                "translate(" + (width/2) + " ," + 
                            (height + margin.top + 30) + ")")
        .style("text-anchor", "middle")
        .text("Position")

        sVg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("P-Value"); 

        //Data
        sVg
            .selectAll('circle')
            .data(this.state.fullData)
            .enter()
            .filter(function(x){return x.gene != "ENSG00000171163"})
            .append("circle")
                .attr("cx", function(d){ return x(d.pos) })
                .attr("cy", function(d){ return y(d.pVal) })
                .attr("r", 3)
                .attr("fill", Colors[0][0])

        sVg
            .selectAll('circle2')
            .data(this.state.fullData)
            .enter()
            .filter(function(x){return x.gene == "ENSG00000171163"})
            .append("circle")
                .attr("cx", function(d){ return x(d.pos) })
                .attr("cy", function(d){ return y(d.pVal) })
                .attr("r", 3)
                .attr("fill", 'red')


        var colunmWidth = x(this.state.range.end)-x(this.state.range.start)

        sVg.append("rect")
            .attr("width", colunmWidth)
            .attr("height", height)
            .attr("fill", Colors[1][0])
            .attr("fill-opacity", "0.6")
            .attr('transform','translate(' + x(this.state.range.start) +',0)')

        let colunmWidthLeft =  x(this.state.range.start) - x(Math.max(this.state.range.start - this.state.range.padding,0)), 
        colunmWidthRight =  x(this.state.range.start) - x(this.state.range.start - this.state.range.padding) 

        sVg.append("rect")
            .attr("width", colunmWidthLeft)
            .attr("height", height)
            .attr("fill", 'green')
            .attr("fill-opacity", "0.2")
            .attr('transform','translate(' + x(Math.max(this.state.range.start - this.state.range.padding,0)) +',0)')

        sVg.append("rect")
            .attr("width", colunmWidthRight)
            .attr("height", height)
            .attr("fill", 'green')
            .attr("fill-opacity", "0.2")
            .attr('transform','translate(' + x(this.state.range.end) +',0)')

    }

    render() {
        return (
            <div>
                <Svg id="MainGraphArea" ref={node => this.node = node}
                    width={this.props.size[0]} height={this.props.size[1]}>
                </Svg>
                <RangeSlider/>
            </div>
        )
    }
}


export default ScatterPlot;