import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import {
  BaseButton,
  Button,
  PrimaryButton,
  TextButton
} from './Button'



describe('UI/Button', () => {

  it('Renders BaseButton correctly', () => {
    const { asFragment } = render(<BaseButton borderColor='white' backgroundColor='white' textColor='black' />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders Button correctly', () => {
    const { asFragment } = render(<Button />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders PrimaryButton correctly', () => {
    const { asFragment } = render(<PrimaryButton />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders TextButton correctly', () => {
    const { asFragment } = render(<TextButton />)
    expect(asFragment()).toMatchSnapshot()
  })

})