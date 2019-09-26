import React from 'react'
import { render } from '@testing-library/react'

import Citations from './Citations'

describe('UI/Citations', () => {

  it('Renders Citations correctly', () => {
    const { asFragment } = render(<Citations />)
    expect(asFragment()).toMatchSnapshot()
  })

})