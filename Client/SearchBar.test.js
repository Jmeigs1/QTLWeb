import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router } from "react-router-dom"


import SearchBar from './SearchBar'

afterEach(cleanup)

describe('SearchBar', () => {

  it('Renders correctly', () => {
    const { asFragment } = render(<Router><SearchBar /></Router>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Inputs correctly', () => {
    const { getByLabelText } = render(<Router><SearchBar /></Router>)
    const input = getByLabelText('searchbar__input')
    expect(input).not.toBeNull()

    fireEvent.change(input, { target: { value: 'A8MVU1' } })
    expect(input.value).toBe('A8MVU1')
  })

})