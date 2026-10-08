/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

describe('Dialog components', () => {
  it('renders Dialog with open state and content', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <DialogDescription>Some description</DialogDescription>
          <DialogFooter>
            <button>OK</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByText('Test Dialog')).toBeInTheDocument()
    expect(screen.getByText('Some description')).toBeInTheDocument()
  })

  it('renders DialogHeader', () => {
    render(
      <DialogHeader>
        <span>Header content</span>
      </DialogHeader>,
    )
    expect(screen.getByText('Header content')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="dialog-header"]')).toBeInTheDocument()
  })

  it('renders DialogFooter', () => {
    render(
      <DialogFooter>
        <button>Cancel</button>
        <button>Submit</button>
      </DialogFooter>,
    )
    expect(document.querySelector('[data-slot="dialog-footer"]')).toBeInTheDocument()
  })

  it('renders DialogContent without close button when showCloseButton is false', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogTitle>No close</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByText('No close')).toBeInTheDocument()
    // Close button should not be present
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('renders DialogContent with default close button', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>With close</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('renders DialogTitle with correct slot', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>My Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    expect(document.querySelector('[data-slot="dialog-title"]')).toBeInTheDocument()
  })

  it('renders DialogDescription with correct slot', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>T</DialogTitle>
          <DialogDescription>My Desc</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    expect(document.querySelector('[data-slot="dialog-description"]')).toBeInTheDocument()
  })

  it('renders DialogTrigger as button that opens dialog', () => {
    render(
      <Dialog>
        <DialogTrigger>
          <button>Open</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Triggered</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('applies custom className to DialogHeader', () => {
    render(<DialogHeader className="custom-h">h</DialogHeader>)
    expect(document.querySelector('.custom-h')).toBeInTheDocument()
  })

  it('applies custom className to DialogFooter', () => {
    render(<DialogFooter className="custom-f">f</DialogFooter>)
    expect(document.querySelector('.custom-f')).toBeInTheDocument()
  })

  it('renders DialogClose', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>T</DialogTitle>
          <DialogClose>
            <button>Manual Close</button>
          </DialogClose>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByText('Manual Close')).toBeInTheDocument()
  })
})
