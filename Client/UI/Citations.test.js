import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Citations from './Citations'

describe('UI/Citations', () => {

  it('Renders Citations correctly', () => {
    const { asFragment } = render(<Citations />)
    expect(asFragment()).toMatchSnapshot()
  })

})