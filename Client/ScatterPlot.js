import React, { Component } from 'react';
import styled from 'styled-components'

import * as d3 from "d3"

import * as TestData from './TestData'
import Colors from './UI/Colors'

import os from 'os'

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
        position: [],
        pValue: [],
        dataLoaded: false
    }

    componentDidMount() {
        this.mounted = true
        this.loadData()
        this.createScatterPlot()
    }

    componentDidUpdate() {
        this.createScatterPlot()
    }

    loadData() {
        var pvals = TestData.geneData

        // fetch('/file.txt')
        // .then(res => {return res.text()})
        // .then(data => {
        //     pvals = data
        //     })

        var lines = pvals.split(os.EOL)

        var fullData = []
        var pvals = []
        var line
        
        for(var i = 0; i < lines.length; i++){
            line = lines[i].split(' ')
            pvals.push(line[3])
            fullData.push(
                {
                    'gene': line[1].toString(),
                    'pos':  parseInt(line[2]),
                    'pVal': line[3]
                }
            )
        }

        this.setState({
            range: {
                'start':TestData.range.start,
                'end':TestData.range.end,
                'padding':TestData.range.padding
            },
            geneName: "ENSG00000171163",
            fullData: fullData,
            pvals: pvals,
            dataLoaded: true
        })
        
    }

    createScatterPlot(){
        if (!this.state.dataLoaded) {
            return
        }

        const node = this.node

        const dataMaxP = d3.max(this.state.pvals)
        const dataMinP = d3.min(this.state.pvals)

        const dataMaxSite = TestData.range.end + TestData.range.padding
        const dataMinSite = TestData.range.start - TestData.range.padding

        const margin = {top: 10, right: 10, bottom: 40, left: 50},
        width = this.props.size[0] - margin.left - margin.right,
        height = this.props.size[1] - margin.top - margin.bottom

        // append the svg object to the body of the page
        var sVg = d3.select(node)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // X scale and Axis
        var x = d3.scaleLinear()
            .domain([dataMinSite, dataMaxSite])
            .range([0, width])
            .nice()
        
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
        var y = d3.scaleLinear()
            .domain([dataMinP, dataMaxP])
            .range([height, 0])     
            .nice()

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

        colunmWidth =  x(this.state.range.start) - x(this.state.range.start - this.state.range.padding) 

        sVg.append("rect")
            .attr("width", colunmWidth)
            .attr("height", height)
            .attr("fill", 'green')
            .attr("fill-opacity", "0.2")
            .attr('transform','translate(' + x(this.state.range.start - this.state.range.padding) +',0)')

        sVg.append("rect")
            .attr("width", colunmWidth)
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