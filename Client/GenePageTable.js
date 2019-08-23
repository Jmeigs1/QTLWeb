import React, { Component } from 'react'

import { Link } from './UI/BasicElements'
import {
    StyledTableCell,
    StyledTableCellHeader,
    StyledTable,
    StyledTableHead,
    StyledTableRoot,
    StyledTableRow,
}
from './UI/Table'

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
            <StyledTableRoot style={{height:"500px"}}>
              <StyledTable>
                <StyledTableHead>
                  <tr>
                    <StyledTableCellHeader key={'_index'} >RefSNP Number</StyledTableCellHeader>
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
                        <StyledTableRow 
                            key={i}>
                            <StyledTableCell key={i + '_Link'}> 
                                    <Link to={"/gene/" + row.EnsID + "/site/" + row.Site}>Link for Now</Link>
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
                </tbody>
              </StyledTable>
            </StyledTableRoot>
          )
    }
}

export default GenePageTable;
