import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

describe('UI Components', () => {
  describe('Button', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })

    it('should render primary variant', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-600')
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-100')
    })

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-gray-100')
    })

    it('should handle different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5')

      rerender(<Button size="md">Medium</Button>)
      expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2')

      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3')
    })

    it('should be disabled when prop is set', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should call onClick handler', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<Button disabled onClick={handleClick}>Click</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>)
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })

  describe('Card', () => {
    it('should render card with children', () => {
      render(
        <Card>
          <div data-testid="card-content">Content</div>
        </Card>
      )
      expect(screen.getByTestId('card-content')).toBeInTheDocument()
    })

    it('should apply default styles', () => {
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-sm')
    })

    it('should accept custom className', () => {
      render(<Card data-testid="card" className="custom-class">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('custom-class')
    })
  })

  describe('CardHeader', () => {
    it('should render with padding and border', () => {
      render(<CardHeader data-testid="header">Header Content</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('p-6', 'border-b')
    })
  })

  describe('CardContent', () => {
    it('should render with padding', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      expect(screen.getByTestId('content')).toHaveClass('p-6')
    })
  })

  describe('CardTitle', () => {
    it('should render as h3 element', () => {
      render(<CardTitle>Title</CardTitle>)
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title')
    })

    it('should apply font styles', () => {
      render(<CardTitle>Title</CardTitle>)
      expect(screen.getByRole('heading')).toHaveClass('text-lg', 'font-semibold')
    })
  })

  describe('Progress', () => {
    it('should render with correct percentage', () => {
      render(<Progress value={65} showLabel />)
      expect(screen.getByText('65%')).toBeInTheDocument()
    })

    it('should clamp value between 0 and 100', () => {
      const { rerender } = render(<Progress value={-10} showLabel />)
      expect(screen.getByText('0%')).toBeInTheDocument()

      rerender(<Progress value={150} showLabel />)
      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('should render different variants', () => {
      const { rerender, container } = render(<Progress value={50} variant="default" />)
      expect(container.querySelector('.bg-primary-600')).toBeInTheDocument()

      rerender(<Progress value={50} variant="success" />)
      expect(container.querySelector('.bg-green-500')).toBeInTheDocument()

      rerender(<Progress value={50} variant="warning" />)
      expect(container.querySelector('.bg-yellow-500')).toBeInTheDocument()
    })

    it('should render different sizes', () => {
      const { rerender, container } = render(<Progress value={50} size="sm" />)
      expect(container.querySelector('.h-1\\.5')).toBeInTheDocument()

      rerender(<Progress value={50} size="md" />)
      expect(container.querySelector('.h-2\\.5')).toBeInTheDocument()

      rerender(<Progress value={50} size="lg" />)
      expect(container.querySelector('.h-4')).toBeInTheDocument()
    })

    it('should show label when showLabel is true', () => {
      render(<Progress value={75} showLabel />)
      expect(screen.getByText('Voortgang')).toBeInTheDocument()
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    it('should hide label when showLabel is false', () => {
      render(<Progress value={75} showLabel={false} />)
      expect(screen.queryByText('Voortgang')).not.toBeInTheDocument()
    })
  })
})

describe('Composite Components', () => {
  describe('Card with all parts', () => {
    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content here</p>
          </CardContent>
        </Card>
      )

      expect(screen.getByRole('heading')).toHaveTextContent('Test Card')
      expect(screen.getByText('Card content here')).toBeInTheDocument()
    })
  })
})
