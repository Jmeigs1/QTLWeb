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
import {tableCols} from './UI/Datasets'

import {format} from 'd3-format'

let d3format = format(".3e")

class GenePageTable extends Component {

    constructor(props, context) {
        super(props, context)

        this._rowClassName = this._rowClassName.bind(this)

        this._table = React.createRef();

        this.state = {
            highlightIndex: -1,
        }
    }
    componentDidMount(){

    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.filterValue != prevProps.filterValue){
            this.setState({
                highlightIndex: -1,
            })
        }
    }

    _rowClassName({index}) {
        let classList = ""

        if(this.state.highlightIndex){
            if(index == this.state.highlightIndex){
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

        let rows = this.props.filteredData

        return (
            <StyledTableRoot id="table-root" style={{backgroundColor:"white",fontSize:"12px"}}>
                <AutoSizer disableHeight>
                {({width}) => (
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
                        scrollToIndex={this.state.highlightIndex}
                        // rowRenderer={(props) => (<div id={`row_${props.rowData.filterdIndex}`}><DefaultTableRowRenderer {...props} /></div>)}
                    >
                    {tableCols.map(
                        (col, i) => (
                            <Column
                                key={i}
                                width={200}
                                label={col.displayName}
                                dataKey={i}
                                cellRenderer={
                                    ({rowData}) => {
                                        return (
                                            i > 0 ?
                                            col.numFormat == true ?
                                                (
                                                    <Highlighter
                                                        searchWords={[this.props.filterValue]}
                                                        autoEscape={true}
                                                        textToHighlight={d3format(col.dbName(rowData))}
                                                    />
                                                )
                                                :(
                                                    <Highlighter
                                                        searchWords={[this.props.filterValue]}
                                                        autoEscape={true}
                                                        textToHighlight={col.dbName(rowData)}
                                                    />
                                                )
                                            :(
                                                <Link to={
                                                    `/gene/${rowData.NonIndexedData.GeneSymbol}`+
                                                    `/site/${rowData.Site}`+
                                                    `/chr/${rowData.Chr}`+
                                                    `/dataset/${rowData.Dataset}`}>
                                                    <Highlighter
                                                        searchWords={[this.props.filterValue]}
                                                        autoEscape={true}
                                                        textToHighlight={col.dbName(rowData)}
                                                    />
                                                </Link>
                                            )
                                        )
                                        }
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
