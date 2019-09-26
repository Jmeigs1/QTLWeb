import React from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { render } from '@testing-library/react'

import {
  Link,
  ExternalLink,
  Page
} from './BasicElements'

describe('UI/BasicElements', () => {

  it('Renders Link correctly', () => {
    const { asFragment } = render(<Router><Link to='/' /></Router>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders ExternalLink correctly', () => {
    const { asFragment } = render(<Router><ExternalLink /></Router>)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders Page correctly', () => {
    const { asFragment } = render(<Page />)
    expect(asFragment()).toMatchSnapshot()
  })

})