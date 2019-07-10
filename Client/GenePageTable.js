import React, { Component } from 'react';

import styled from 'styled-components'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import colors from './UI/Colors'


const StyledTableCell = styled(TableCell)`
    font-size: 12px !important;
    color: ${colors[0][2]} !important;
`

const StyledTableCellHeader = styled(TableCell)`
    font-size: 12px !important;
    color: white !important;
    background-color: ${colors[0][2]};
`

const StyledTable = styled(Table)`
    min-width: 650px;
`

const StyledTableHead = styled(TableHead)`
    position: sticky;
    top: 0px;
    z-index: 10;
`

const StyledTableRoot = styled(Paper)`
    width: 100%;
    margin-top: 50px;
    overflow-x: auto;
    height: 500px;
`

const StyledTableRow = styled(TableRow)`
    &:hover {
        background: ${colors[2][1]};
    }
`

function columnData(displayName, dbName){
    return {displayName, dbName}
}

const cols = [
    columnData('Associated Gene', 'gene'),
    columnData('Relative Position', 'pos'),
    columnData('Log 10 ( P-Value )', 'pVal'),
    columnData('Log 10 ( P-Value )', 'pVal'),
    columnData('Log 10 ( P-Value )', 'pVal'),
    columnData('Log 10 ( P-Value )', 'pVal'),
]
  
function rowData(gene, pos, pVal) {
    return { gene, pos, pVal };
}

// const rows = [
//     rowData('ENSG00000175137', 249060199, 2.80339389397347),
//     rowData('ENSG00000175137', 249060338, 0.321177582009123),
//     rowData('ENSG00000175137', 249061050, 2.71480889696523),
//     rowData('ENSG00000175137', 249062270, 2.80339389397347),
//     rowData('ENSG00000175137', 249062320, 1.07101841049882),
//     rowData('ENSG00000175137', 249060264, 2.80339389397347),
// ];

class GenePageTable extends Component {

    
    render() {
        let rows = this.props.resultsData.fullData

        return (
            <StyledTableRoot>
              <StyledTable>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCellHeader key={'_index'} >Index</StyledTableCellHeader>
                  {cols.map((col, i) => (
                    <StyledTableCellHeader key={i} >{col.displayName}</StyledTableCellHeader>
                  ))}
                  </TableRow>
                </StyledTableHead>
                <TableBody style={{height: '500px',
                overflow: 'hidden auto',
                willChange: 'transform',
                // display: 'block',
                width: this.props.size[0]}}>
                    {
                        rows ?
                        rows.map((row, i) => (
                        <StyledTableRow key={i}>
                            <StyledTableCell key={i + '_Index'}> {i} </StyledTableCell>
                            {cols.map((col, j) =>(
                                <StyledTableCell key={i + '_' + j}>
                                    {row[col.dbName]}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        )) :
                        (<StyledTableRow/>)
                    }
                </TableBody>
              </StyledTable>
            </StyledTableRoot>
          );
    }
}

export default GenePageTable;
