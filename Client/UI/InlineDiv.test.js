import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import InlineDiv from './InlineDiv'


describe('UI/InlineDiv', () => {

  it('Renders correctly', () => {
    const { asFragment } = render(<InlineDiv
      style={{ background: 'red' }}
      children={[
        (<p>Test 1</p>),
        (<p>Test 2</p>)
      ]}
    />)
    expect(asFragment()).toMatchSnapshot()
  })

})