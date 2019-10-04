import React, { Component } from 'react'
import styled from 'styled-components'

import {DatasetDisplayName} from './UI/Datasets'

const TableFilter = styled.input`
    text-align: center;
`

const columnData = (displayName, dbName) => {
    return {displayName, dbName}
}

const cols = [
    columnData('Genomic Coordinates', (x) => x.Coordinate),
    columnData('Dataset', (x) => DatasetDisplayName[x.Dataset].downloadLabel),
    columnData('Associated Gene', (x) => x.NonIndexedData.GeneSymbol),
    columnData('RefSNP Number', (x) => x.BystroData["gnomad.genomes.id"]),
    columnData('P-Value', (x) => x.NonIndexedData.pvalue),
    columnData('Bonf Corrected P-Value', (x) => x.NonIndexedData.Bonferronipvalue),
    columnData('FDR', (x) => x.NonIndexedData.FDR),
]

class GenePageTableFilter extends Component {

    constructor(props){
        super(props)

        this.state = {
            filterValue: this.props.filterValue,
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.filterValue != this.props.filterValue){
            this.setState({
                filterValue: this.props.filterValue,
            })
        }
    }
    
    render() {
        return (
            <div>
                <TableFilter 
                    onChange={(e) => {
                        this.setState({
                            filterValue: e.target.value,
                        },() => {
                            this.props.filterResultsFunc(this.state.filterValue)
                        })
                    }}
                    value={this.state.filterValue}
                    placeholder='Filter Results'/>
                <GenePageTableDownloadButton 
                    geneSymbol = {this.props.geneSymbol}
                    filteredData = {this.props.filteredData}
                />
            </div>
        )
    }
}

class GenePageTableDownloadButton extends Component {

    constructor(props){
        super(props)
    }

    shouldComponentUpdate(){
        return false
   }

    downloadHander(props) {

        //Temp disable this feature
        return

        if(props.filteredData.length == 0){
            return
        }

        const baseFileName = "QTLWeb_" + this.props.geneSymbol + "_"

        const date = new Date()
        const timestamp = `${date.getFullYear()}_${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}_${date
            .getDate()
            .toString()
            .padStart(2, '0')}_${date
            .getHours()
            .toString()
            .padStart(2, '0')}_${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}_${date
            .getSeconds()
            .toString()
            .padStart(2, '0')}`

        let csv = ""

        let header = Object.keys(props.filteredData[0].NonIndexedData)

        let filterHeaders = ["EnsemblGeneID","UniprotID","GeneSymbol","pvalue","Bonferronipvalue","FDR","log10pvalue","SNPAbsoluteGenomicPosition"]

        header = header.filter( o => (filterHeaders.indexOf(o) == -1))

        for(let i = 0; i < cols.length; i++){
            csv += `${cols[i].displayName},`
        }

        for(let i = 0; i < header.length; i++){
            csv += `${header[i]},`
        }
        csv = csv.slice(0,-1)
        csv += `\n`

        for(let i = 0; i < props.filteredData.length; i++){
            
            for(let j = 0; j < cols.length; j++){
                csv += `${cols[j].dbName(props.filteredData[i])},`
            }

            for(let j = 0; j < header.length; j++){
                csv += `${props.filteredData[i].NonIndexedData[header[j]]},`
            }
            csv = csv.slice(0,-1)
            csv += `\n`
        }

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `${baseFileName.replace(/\s+/g, '_')}_${timestamp}.csv`)
        link.onClick = () => {
            URL.revokeObjectURL(url)
            link.remove()
        }
        document.body.appendChild(link)
        link.click()

    }

    render() {
        return (
            <button
                type='file'
                accept='*'
                onClick={() => this.downloadHander(this.props)}
                style = {{float:'right'}}
            > 
                Download (Coming Soon)
            </button>
        )
    }
}

export default GenePageTableFilter