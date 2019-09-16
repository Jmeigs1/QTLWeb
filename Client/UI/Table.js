import styled from 'styled-components'
import colors from './Colors'

export const StyledTable = styled.table`
    width:100%;
    background-color: white;
    overflow: scroll;
`

export const StyledTableBody = styled.tbody`
    overflow: scroll;
`

export const StyledTableCell = styled.td`
    font-size: 12px !important;
    font-family: Raleway, sans-serif !important;
    color: ${colors[0][2]} !important;

    padding: 10px;
`

export const StyledTableCellHeader = styled.td`
    font-size: 12px !important;
    color: white !important;
    background-color: ${colors[0][2]};

    padding: 10px;
`

export const StyledTableHead = styled.thead`
`

export const StyledTableRoot = styled.div`
    /* width: 100%; */
    margin-top: 0px;
    overflow-x: auto;
    /* height: 500px; */
    margin: 0;
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
`

export const StyledTableRootInline = styled.div`
    overflow-x: auto;
    width: 50%;
    display: inline-block;
    padding: 20px;
    margin: 0;
    box-sizing: border-box;
`

export const StyledTableRow = styled.tr`
    &:hover {
        background: ${colors[2][1]};
    }

    &:hover td {

    }
`

export const StyledTableRowHead = styled.tr`
    position: sticky;
    top: 0px;
    z-index: 10;
`