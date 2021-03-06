import React from 'react'

import { colors } from './Colors'

describe('UI/Colors', () => {

  it('Contains 4 distinct colors', () => {
    expect(colors.length).toBe(4)
  })

  it('Holds the right colors', () => {
    colors.map((col) => {
      expect(col).toMatchSnapshot()
    })
  })

})