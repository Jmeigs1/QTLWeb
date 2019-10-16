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
import {DatasetDisplayName} from './UI/Datasets'

const columnData = (displayName, dbName) => {
    return {displayName, dbName}
}

const cols = [
    columnData('Dataset', (x) => DatasetDisplayName[x.Dataset].downloadLabel),
    columnData('Associated Gene', (x) => x.NonIndexedData.GeneSymbol),
    columnData('RefSNP Number', (x) => x.BystroData["gnomad.genomes.id"]),
    columnData('P-Value', (x) => x.NonIndexedData.pvalue),
    columnData('Bonf Corrected P-Value', (x) => x.NonIndexedData.Bonferronipvalue),
    columnData('FDR', (x) => x.NonIndexedData.FDR),
]

class GenePageTable extends Component {

    shouldComponentUpdate(nextProps){
        //Hack for now.  Server side render later.
        return( 
            nextProps.filteredData[0] != this.props.filteredData[0] 
            || nextProps.filteredData.length != this.props.filteredData.length
            || (nextProps.scrollPos != this.props.scrollPos && nextProps.scrollPos))
    }

    render() {
        let rows = this.props.filteredData

        return (
            <StyledTableRoot id="table-root" style={{height:"500px"}}>
                <StyledTable>
                    <StyledTableHead>
                    <StyledTableRowHead>
                        <StyledTableCellHeader key={'_index'} >Genomic Coordinates</StyledTableCellHeader>
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
                                    id={`row_${row.index}`}
                                    key={row.index}>
                                    <StyledTableCell key={i + '_Link'}> 
                                            <Link to={
                                                `/gene/${row.NonIndexedData.GeneSymbol}`+
                                                `/site/${row.Site}`+
                                                `/chr/${row.Chr}`+
                                                `/dataset/${row.Dataset}`}>
                                                {row.Coordinate}
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
