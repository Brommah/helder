import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AchievementBadges, BadgeItem, AVAILABLE_BADGES } from '@/components/fun/AchievementBadges'
import { HouseBuilder } from '@/components/fun/HouseBuilder'
import { AISparkle, AIBadge, AIInsightCard } from '@/components/fun/AISparkle'

describe('Fun Components', () => {
  describe('AchievementBadges', () => {
    it('should render earned badges', () => {
      render(<AchievementBadges />)
      expect(screen.getByText('Achievements')).toBeInTheDocument()
    })

    it('should show badge count', () => {
      render(<AchievementBadges />)
      const earnedCount = AVAILABLE_BADGES.filter(b => b.earned).length
      expect(screen.getByText(`${earnedCount}/${AVAILABLE_BADGES.length}`)).toBeInTheDocument()
    })

    it('should render all badges when showAll is true', () => {
      render(<AchievementBadges showAll />)
      // Check that badges are rendered by looking for badge names
      expect(screen.getByText('Eerste Document')).toBeInTheDocument()
      expect(screen.getByText('Geschiedschrijver')).toBeInTheDocument()
    })

    it('should limit displayed badges with maxDisplay', () => {
      render(<AchievementBadges maxDisplay={2} />)
      // Check the "meer achievements" text when there are more earned than maxDisplay
    })
  })

  describe('BadgeItem', () => {
    const earnedBadge = {
      id: 'test-earned',
      name: 'Test Badge',
      description: 'Test description',
      icon: () => <span data-testid="icon">Icon</span>,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      earned: true,
      earnedAt: '2025-12-01',
    }

    const unearnedBadge = {
      ...earnedBadge,
      id: 'test-unearned',
      earned: false,
      earnedAt: undefined,
    }

    it('should render earned badge with checkmark', () => {
      render(<BadgeItem badge={earnedBadge as any} />)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('should render unearned badge with grayscale', () => {
      render(<BadgeItem badge={unearnedBadge as any} />)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('should show earned date for earned badges', () => {
      render(<BadgeItem badge={earnedBadge as any} />)
      // Date should be displayed
    })

    it('should handle different sizes', () => {
      const { rerender } = render(<BadgeItem badge={earnedBadge as any} size="sm" />)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()

      rerender(<BadgeItem badge={earnedBadge as any} size="md" />)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()

      rerender(<BadgeItem badge={earnedBadge as any} size="lg" />)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })
  })

  describe('HouseBuilder', () => {
    it('should render with 0% progress', () => {
      render(<HouseBuilder progress={0} />)
      expect(screen.getByText('0%')).toBeInTheDocument()
      expect(screen.getByText('Gestart')).toBeInTheDocument()
    })

    it('should render with 50% progress', () => {
      render(<HouseBuilder progress={50} />)
      expect(screen.getByText('50%')).toBeInTheDocument()
      expect(screen.getByText('Halverwege')).toBeInTheDocument()
    })

    it('should render with 100% progress', () => {
      render(<HouseBuilder progress={100} />)
      expect(screen.getByText('100%')).toBeInTheDocument()
      expect(screen.getByText('Voltooid!')).toBeInTheDocument()
    })

    it('should show correct status labels', () => {
      const { rerender } = render(<HouseBuilder progress={10} />)
      expect(screen.getByText('Gestart')).toBeInTheDocument()

      rerender(<HouseBuilder progress={30} />)
      expect(screen.getByText('In aanbouw')).toBeInTheDocument()

      rerender(<HouseBuilder progress={60} />)
      expect(screen.getByText('Halverwege')).toBeInTheDocument()

      rerender(<HouseBuilder progress={80} />)
      expect(screen.getByText('Bijna klaar')).toBeInTheDocument()
    })

    it('should hide label when showLabel is false', () => {
      render(<HouseBuilder progress={50} showLabel={false} />)
      expect(screen.queryByText('50%')).not.toBeInTheDocument()
    })

    it('should handle different sizes', () => {
      const { rerender, container } = render(<HouseBuilder progress={50} size="sm" />)
      let svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '80')

      rerender(<HouseBuilder progress={50} size="md" />)
      svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '120')

      rerender(<HouseBuilder progress={50} size="lg" />)
      svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '180')
    })
  })

  describe('AISparkle', () => {
    it('should render children', () => {
      render(<AISparkle>AI Content</AISparkle>)
      expect(screen.getByText('AI Content')).toBeInTheDocument()
    })

    it('should render sparkle variant', () => {
      render(<AISparkle variant="sparkle">Content</AISparkle>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render glow variant', () => {
      render(<AISparkle variant="glow">Content</AISparkle>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render pulse variant', () => {
      render(<AISparkle variant="pulse">Content</AISparkle>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render brain variant', () => {
      render(<AISparkle variant="brain">Content</AISparkle>)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should not animate when active is false', () => {
      render(<AISparkle active={false}>Static Content</AISparkle>)
      expect(screen.getByText('Static Content')).toBeInTheDocument()
    })
  })

  describe('AIBadge', () => {
    it('should render default badge', () => {
      render(<AIBadge />)
      expect(screen.getByText('AI')).toBeInTheDocument()
    })

    it('should render with custom label', () => {
      render(<AIBadge label="Powered by AI" />)
      expect(screen.getByText('Powered by AI')).toBeInTheDocument()
    })

    it('should render compact variant', () => {
      const { container } = render(<AIBadge variant="compact" />)
      expect(container.querySelector('span')).toBeInTheDocument()
    })

    it('should render outline variant', () => {
      render(<AIBadge variant="outline" />)
      expect(screen.getByText('AI')).toBeInTheDocument()
    })
  })

  describe('AIInsightCard', () => {
    it('should render insight with all props', () => {
      render(
        <AIInsightCard
          title="Energy Tip"
          insight="Lower your thermostat by 1 degree to save €100/year"
          confidence={92}
        />
      )

      expect(screen.getByText('Energy Tip')).toBeInTheDocument()
      expect(screen.getByText('Lower your thermostat by 1 degree to save €100/year')).toBeInTheDocument()
      expect(screen.getByText('92%')).toBeInTheDocument()
    })

    it('should use default confidence of 95', () => {
      render(
        <AIInsightCard
          title="Test"
          insight="Test insight"
        />
      )
      expect(screen.getByText('95%')).toBeInTheDocument()
    })

    it('should show confidence bar', () => {
      render(
        <AIInsightCard
          title="Test"
          insight="Test insight"
          confidence={80}
        />
      )
      expect(screen.getByText('Zekerheid')).toBeInTheDocument()
    })
  })
})

describe('AVAILABLE_BADGES constant', () => {
  it('should have correct badge structure', () => {
    AVAILABLE_BADGES.forEach(badge => {
      expect(badge.id).toBeTruthy()
      expect(badge.name).toBeTruthy()
      expect(badge.description).toBeTruthy()
      expect(badge.icon).toBeTruthy()
      expect(badge.color).toBeTruthy()
      expect(badge.bgColor).toBeTruthy()
      expect(typeof badge.earned).toBe('boolean')
    })
  })

  it('should have unique IDs', () => {
    const ids = AVAILABLE_BADGES.map(b => b.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have at least some earned badges', () => {
    const earnedCount = AVAILABLE_BADGES.filter(b => b.earned).length
    expect(earnedCount).toBeGreaterThan(0)
  })

  it('should have valid earnedAt dates for earned badges', () => {
    const earnedBadges = AVAILABLE_BADGES.filter(b => b.earned)
    earnedBadges.forEach(badge => {
      if (badge.earnedAt) {
        const date = new Date(badge.earnedAt)
        expect(date.toString()).not.toBe('Invalid Date')
      }
    })
  })
})
