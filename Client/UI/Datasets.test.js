import React from 'react'

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