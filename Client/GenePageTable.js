import React, { Component } from 'react'

import { Link } from './UI/BasicElements'
import {
    StyledTable,
    StyledTableBody,
    StyledTableCell,
    StyledTableCellHeader,
    StyledTableHead,
    StyledTableRoot,
    StyledTableRow,
    StyledTableRowHead,
}
from './UI/Table'

const columnData = (displayName, dbName) => {
    return {displayName, dbName}
}

const cols = [
    columnData('Associated Gene', (x) => x.NonIndexedData.GeneSymbol),
    columnData('Genomic Coordinates', (x) => x.Coordinate),
    columnData('P-Value', (x) => x.NonIndexedData.pvalue),
    columnData('Bonf Corrected P-Value', (x) => x.NonIndexedData.Bonferronipvalue),
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
            <StyledTableRoot style={{height:"500px"}}>
              <StyledTable>
                <StyledTableHead>
                  <StyledTableRowHead>
                    <StyledTableCellHeader key={'_index'} >RefSNP Number</StyledTableCellHeader>
                  {cols.map((col, i) => (
                    <StyledTableCellHeader key={i} >{col.displayName}</StyledTableCellHeader>
                  ))}
                  </StyledTableRowHead>
                </StyledTableHead>
                <StyledTableBody>
                    {
                        rows ?
                        rows.map((row, i) => (
                        <StyledTableRow 
                            key={i}>
                            <StyledTableCell key={i + '_Link'}> 
                                    <Link to={
                                        `/gene/${row.NonIndexedData.GeneSymbol}`+
                                        `/site/${row.Site}`+
                                        `/chr/${row.Chr}`+
                                        `/dataset/${row.Dataset}`}>
                                        {row.BystroData["gnomad.genomes.id"]}
                                    </Link>
                            </StyledTableCell>
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
                </StyledTableBody>
              </StyledTable>
            </StyledTableRoot>
          )
    }
}

export default GenePageTable
