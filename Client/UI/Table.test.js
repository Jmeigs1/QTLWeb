import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableCellHeader,
  StyledTableHead,
  StyledTableRoot,
  StyledTableRootInline,
  StyledTableRow,
  StyledTableRowHead
} from './Table'

describe('UI/Table', () => {

  it('Renders StyledTable correctly', () => {
    const { asFragment } = render(<StyledTable />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders StyledTableBody correctly', () => {
    const { asFragment } = render(<table><StyledTableBody /></table>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders StyledTableCell correctly', () => {
    const { asFragment } = render(<table><tbody><tr><StyledTableCell /></tr></tbody></table>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders StyledTableCellHeader correctly', () => {
    const { asFragment } = render(<table><tbody><tr><StyledTableCellHeader /></tr></tbody></table>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders StyledTableHead correctly', () => {
    const { asFragment } = render(<table><StyledTableHead /></table>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders StyledTableRoot correctly', () => {
    const { asFragment } = render(<StyledTableRoot />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders StyledTableRootInline correctly', () => {
    const { asFragment } = render(<StyledTableRootInline />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders StyledTableRow correctly', () => {
    const { asFragment } = render(<table><tbody><StyledTableRow /></tbody></table>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders StyledTableRowHead correctly', () => {
    const { asFragment } = render(<table><tbody><StyledTableRowHead /></tbody></table>)
    expect(asFragment()).toMatchSnapshot()
  })

})