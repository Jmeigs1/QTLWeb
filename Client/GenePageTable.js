import React, { Component } from 'react'

import styled from 'styled-components'

import colors from './UI/Colors'

const StyledTableCell = styled.td`
    font-size: 12px !important;
    font-family: Raleway, sans-serif !important;
    color: ${colors[0][2]} !important;

    padding: 10px;
`

const StyledTableCellHeader = styled.td`
    font-size: 12px !important;
    color: white !important;
    background-color: ${colors[0][2]};

    padding: 10px;
`

const StyledTable = styled.table`
    min-width: 650px;
    width:100%;
`

const StyledTableHead = styled.thead`
    position: sticky;
    top: 0px;
    z-index: 10;
`

const StyledTableRoot = styled.div`
    width: 100%;
    margin-top: 0px;
    overflow-x: auto;
    height: 500px;

    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
    background-color: white;
`

const StyledTableRow = styled.tr`
    &:hover {
        background: ${colors[2][1]};
        cursor: pointer;
    }

    &:hover td {
        font-weight:bold;
    }
`

const columnData = (displayName, dbName) => {
    return {displayName, dbName}
}

const cols = [
    columnData('Associated Gene', (x) => x.EnsID),
    columnData('Genomic Coordinates', (x) => x.Coordinate),
    columnData('P-Value', (x) => x.NonIndexedData.PValue),
    columnData('Bonf Corrected P-Value', (x) => x.NonIndexedData.BonferroniPValue),
    columnData('FDR', (x) => x.NonIndexedData.FDR),
]

class GenePageTable extends Component {

    shouldComponentUpdate(prevProps){
        //Hack for now.  Server side render later.
        return( 
            prevProps.filteredData[0] != this.props.filteredData[0] 
            || prevProps.filteredData.length != this.props.filteredData.length )
    }

    render() {
        let rows = this.props.filteredData

        return (
            <StyledTableRoot>
              <StyledTable>
                <StyledTableHead>
                  <tr>
                    <StyledTableCellHeader key={'_index'} >Index</StyledTableCellHeader>
                  {cols.map((col, i) => (
                    <StyledTableCellHeader key={i} >{col.displayName}</StyledTableCellHeader>
                  ))}
                  </tr>
                </StyledTableHead>
                <tbody style={{height: '500px',
                overflow: 'hidden auto',
                // willChange: 'transform',
                // display: 'block',
                width: this.props.size[0]}}>
                    {
                        rows ?
                        rows.map((row, i) => (
                        <StyledTableRow onClick={() => { window.location= "/gene/" + row.EnsID + "/site/" + row.Site}} key={i}>
                            <StyledTableCell key={i + '_Index'}> {i} </StyledTableCell>
                            {cols.map((col, j) =>
                                (
                                    <StyledTableCell key={i + '_' + j}>
                                        {col.dbName(row)}
                                    </StyledTableCell>
                                )
                            )}
                        </StyledTableRow>
                        )) :
                        (<StyledTableRow/>)
                    }
                </tbody>
              </StyledTable>
            </StyledTableRoot>
          )
    }
}

export default GenePageTable;
