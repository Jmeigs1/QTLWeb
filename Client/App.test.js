import React from 'react'
import { render, cleanup } from '@testing-library/react'

import App from './App'

afterEach(cleanup)

describe('App', () => {

  it('Renders correctly', () => {
    const { asFragment } = render(<App />)
    expect(asFragment()).toEqual(expect.anything())
  })

})