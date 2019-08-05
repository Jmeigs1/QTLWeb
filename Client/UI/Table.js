import styled from 'styled-components'
import colors from './Colors'

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

export const StyledTable = styled.table`
    min-width: 650px;
    width:100%;
`

export const StyledTableHead = styled.thead`
    position: sticky;
    top: 0px;
    z-index: 10;
`

export const StyledTableRoot = styled.div`
    /* width: 100%; */
    margin-top: 0px;
    overflow-x: auto;
    /* height: 500px; */

    box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
    background-color: white;
`

export const StyledTableRow = styled.tr`
    &:hover {
        background: ${colors[2][1]};
        cursor: pointer;
    }

    &:hover td {

    }
`