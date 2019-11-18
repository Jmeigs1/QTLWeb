import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'

import { Column, Table, defaultTableRowRenderer as DefaultTableRowRenderer } from 'react-virtualized'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'

import 'react-virtualized/styles.css'
import './css/Table.example.css'

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
import { tableCols } from './UI/Datasets'

// class GenePageTable extends Component {

//     shouldComponentUpdate(nextProps){
//         //Hack for now.  Server side render later.
//         return true
//     }

//     render() {
//         let rows = this.props.filteredData

//         return (
//             <StyledTableRoot id="table-root" style={{height:"500px"}}>
//                 <StyledTable>
//                     <StyledTableHead>
//                     <StyledTableRowHead>
//                         <StyledTableCellHeader key={'_index'} >Genomic Coordinates</StyledTableCellHeader>
//                     {tableCols.map((col, i) => (
//                         <StyledTableCellHeader key={i} >{col.displayName}</StyledTableCellHeader>
//                     ))}
//                     </StyledTableRowHead>
//                     </StyledTableHead>
//                         <StyledTableBody>
//                             {
//                                 rows ?
//                                 rows.map((row, i) => (
//                                 <StyledTableRow
//                                     id={`row_${row.index}`}
//                                     key={row.index}>
//                                     <StyledTableCell key={i + '_Link'}> 
//                                             <Link to={
//                                                 `/gene/${row.NonIndexedData.GeneSymbol}`+
//                                                 `/site/${row.Site}`+
//                                                 `/chr/${row.Chr}`+
//                                                 `/dataset/${row.Dataset}`}>
//                                                 {row.Coordinate}
//                                             </Link>
//                                     </StyledTableCell>
//                                     {tableCols.map((col, j) =>
//                                         (
//                                             <StyledTableCell key={i + '_' + j}>
//                                                 {col.dbName(row)}
//                                             </StyledTableCell>
//                                         )
//                                     )}
//                                     </StyledTableRow>
//                                 )) :
//                                 (<StyledTableRow/>)
//                             }
//                         </StyledTableBody>
//                 </StyledTable>
//             </StyledTableRoot>
//         )
//     }
// }

class GenePageTable extends Component {

    constructor(props, context) {
        super(props, context)

        this._rowClassName = this._rowClassName.bind(this)

        this._table = React.createRef()

        this.state = {
            scrollTop: 0,
            highlightIndex: -1,
        }
    }

    _rowClassName({ index }) {
        let classList = ""

        if (this.state.highlightIndex) {
            if (index == this.state.highlightIndex) {
                classList += "greenFade "
            }
        }

        if (index < 0) {
            return "headerRow"
        } else {
            return classList + (index % 2 === 0 ? "evenRow" : "oddRow")
        }
    }

    render() {

        // let rows = this.props.dataPoints.sort((a, b) => (a.pvalue > b.pvalue) ? 1 : -1)
        let rows = this.props.dataPoints

        return (
            <StyledTableRoot id="table-root" style={{ backgroundColor: "white", fontSize: "12px" }}>
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <Table
                            ref={this._table}
                            width={width}
                            height={500}
                            headerClassName="headerColumn"
                            headerHeight={45}
                            rowHeight={45}
                            rowClassName={this._rowClassName}
                            rowCount={rows.length}
                            rowGetter={({ index }) => rows[index]}
                            onScroll={({ clientHeight, scrollHeight, scrollTop }) => {
                                this.setState({ scrollTop })
                            }}
                            scrollTop={this.state.scrollTop}
                        // rowRenderer={(props) => (<div id={`row_${props.rowData.filterdIndex}`}><DefaultTableRowRenderer {...props} /></div>)}
                        >
                            {tableCols.map(
                                (col, i) => (
                                    <Column
                                        key={i}
                                        width={200}
                                        label={col.displayName}
                                        dataKey={i}
                                        cellRenderer={({ rowData }) => i > 0
                                            ? (
                                                <Highlighter
                                                    searchWords={[this.props.filterValue]}
                                                    autoEscape={true}
                                                    textToHighlight={col.dbName(rowData)}
                                                />
                                            )
                                            : (
                                                <Link to={
                                                    `/gene/${rowData.gene}` +
                                                    `/site/${rowData.position}` +
                                                    `/chr/${rowData.chromosome}` +
                                                    `/dataset/${rowData.dataset}`}>
                                                    <Highlighter
                                                        searchWords={[this.props.filterValue]}
                                                        autoEscape={true}
                                                        textToHighlight={col.dbName(rowData)}
                                                    />
                                                </Link>
                                            )
                                        }
                                    />
                                )
                            )}

                        </Table>
                    )}
                </AutoSizer>
            </StyledTableRoot>
        )
    }
}

export default GenePageTable
