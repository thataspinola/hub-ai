/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from '@/components/ui/select'

describe('Select components', () => {
  it('renders SelectTrigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(document.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument()
  })

  it('applies custom className to SelectTrigger', () => {
    render(
      <Select>
        <SelectTrigger className="my-class">
          <SelectValue />
        </SelectTrigger>
      </Select>,
    )
    expect(document.querySelector('[data-slot="select-trigger"]')).toHaveClass('my-class')
  })

  it('renders SelectTrigger with size sm', () => {
    render(
      <Select>
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
      </Select>,
    )
    expect(document.querySelector('[data-slot="select-trigger"]')).toHaveAttribute(
      'data-size',
      'sm',
    )
  })

  it('renders SelectGroup', () => {
    render(
      <Select>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group A</SelectLabel>
            <SelectItem value="x">X</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    )
    expect(document.querySelector('[data-slot="select-trigger"]')).toBeInTheDocument()
  })

  it('renders SelectScrollUpButton', () => {
    render(
      <Select>
        <SelectContent>
          <SelectScrollUpButton />
          <SelectItem value="a">A</SelectItem>
          <SelectScrollDownButton />
        </SelectContent>
      </Select>,
    )
    // Just verify it doesn't throw
    expect(document.querySelector('[data-slot="select-trigger"]')).not.toBeInTheDocument()
  })

  it('renders SelectSeparator', () => {
    render(
      <Select>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
          <SelectSeparator />
          <SelectItem value="b">B</SelectItem>
        </SelectContent>
      </Select>,
    )
    // Verify no render crash
    expect(document.querySelector('[data-slot="select-content"]')).not.toBeInTheDocument()
  })
})
