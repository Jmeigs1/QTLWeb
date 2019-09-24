import React from 'react'
import '@testing-library/jest-dom/extend-expect'

import {
  Datasets,
  DatasetDisplayName
} from './Datasets'

describe('UI/Datasets', () => {

  it('Contains correct Datasets obj', () => {
    expect(Datasets).toMatchSnapshot()
  })

  it('Contains correct DatasetDisplayName', () => {
    expect(DatasetDisplayName).toMatchSnapshot()
  })

})