import React from 'react'
import { render, cleanup, fireEvent, waitForElement } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import axiosMock from 'axios' // imports from __mocks__

import SearchBar from './SearchBar'

afterEach(cleanup)

describe('SearchBar', () => {

  const props = {
    history: [],
    dataset: 'pqtl',
  }

  it('Renders correctly', () => {
    const { asFragment } = render(<Router><SearchBar {...props} /></Router>)
    expect(asFragment()).toMatchSnapshot()
  })


  it('Gets suggestions from input correctly', async () => {
    const searchTerm = 'A8MV'
    axiosMock.get.mockResolvedValueOnce({
      "data": {
        "took": 118,
        "timed_out": false,
        "_shards": { "total": 1, "successful": 1, "skipped": 0, "failed": 0 },
        "hits": {
          "total": { "value": 1, "relation": "eq" },
          "max_score": 1,
          "hits": [{ "_index": "searchresults", "_type": "_doc", "_id": "pQsNQG0B6LS21W20Qwcl", "_score": 1, "_source": { "Chr": "chr7", "NonIndexedData": { "GeneSymbol": "NCF1C" }, "UniprotID": "A8MVU1" }, "highlight": { "UniprotID": ["<em>A8MVU1</em>"] } }],
        },
      },
    })
    const { getByTestId } = render(<Router><SearchBar {...props} /></Router>)
    const input = getByTestId('searchInput')

    fireEvent.change(input, { target: { value: searchTerm } })
    expect(input.value).toBe(searchTerm)

    fireEvent.keyDown(input, { key: 'Enter', code: 13 })
    fireEvent.focus(input)
    const resolvedSuggestions = await waitForElement(() => getByTestId('searchSuggestions'))

    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(resolvedSuggestions).toMatchSnapshot()
  })

})