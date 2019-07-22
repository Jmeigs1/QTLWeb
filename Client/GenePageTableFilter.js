import React, { Component } from 'react';
import styled from 'styled-components'

const TableFilter = styled.input`
    text-align: center;
`

class GenePageTableFilter extends Component {
    render() {
        return (
            <div>
                <TableFilter 
                    onChange={(e) => {
                        return new Promise((resolve, reject) => {
                            this.props.filterResults(e.target.value)
                        }).then(() => {console.log("Done")})
                    }}
                    placeholder='Filter Results'/>
                <GenePageTableDownloadButton geneSymbol = {this.props.geneSymbol} selected={[[1,2,3],[4,5,6]]}/>
            </div>
        );
    }
}

class GenePageTableDownloadButton extends Component {

    constructor(props){
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState){
        return false
   }

    clickHander(props) {

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

        let data = props.selected
        var csv = 'Name,Title,Other\n'
        data.forEach(function(row) {
                csv += row.join(',')
                csv += "\n"
        });

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `${baseFileName.replace(/\s+/g, '_')}_${timestamp}.csv`)
        link.onClick = () => {
            console.log('revoke')
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
                onClick={() => this.clickHander(this.props)}
                style = {{float:'right'}}
            > 
                Download
            </button>
        );
    }
}

export default GenePageTableFilter;