import { describe, it, expect, vi } from 'vitest'

// Test utility functions
describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format dates correctly in Dutch locale', () => {
      const date = new Date('2025-12-25')
      const formatted = date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      expect(formatted).toContain('25')
      expect(formatted).toContain('2025')
    })

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid')
      expect(invalidDate.toString()).toBe('Invalid Date')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency in Euro format', () => {
      const amount = 125000
      const formatted = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)
      expect(formatted).toContain('125.000')
      expect(formatted).toContain('€')
    })

    it('should handle decimal amounts', () => {
      const amount = 1234.56
      const formatted = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)
      expect(formatted).toContain('1.234,56')
    })

    it('should handle zero', () => {
      const amount = 0
      const formatted = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)
      expect(formatted).toContain('0')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      const percentage = 65
      expect(`${percentage}%`).toBe('65%')
    })

    it('should clamp percentages between 0 and 100', () => {
      const clamp = (val: number) => Math.min(Math.max(val, 0), 100)
      expect(clamp(-10)).toBe(0)
      expect(clamp(150)).toBe(100)
      expect(clamp(50)).toBe(50)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs with prefix', () => {
      const generateId = (prefix: string) =>
        `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const id1 = generateId('doc')
      const id2 = generateId('doc')

      expect(id1).toMatch(/^doc_\d+_[a-z0-9]+$/)
      expect(id1).not.toBe(id2) // Should be unique
    })
  })

  describe('validateEmail', () => {
    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    }

    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('user.name@example.co.nl')).toBe(true)
      expect(validateEmail('user+tag@example.com')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('invalid@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('user@.com')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    const validateDutchPhone = (phone: string) => {
      // E.164 format for Dutch numbers
      const regex = /^\+31[1-9][0-9]{8}$/
      return regex.test(phone.replace(/\s/g, ''))
    }

    it('should validate correct Dutch phone numbers', () => {
      expect(validateDutchPhone('+31612345678')).toBe(true)
      expect(validateDutchPhone('+31 6 12345678')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validateDutchPhone('0612345678')).toBe(false) // Missing +31
      expect(validateDutchPhone('+310612345678')).toBe(false) // Invalid 0 after +31
    })
  })

  describe('slugify', () => {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

    it('should create URL-safe slugs', () => {
      expect(slugify('Villa Zonneweide')).toBe('villa-zonneweide')
      expect(slugify('Project 2025')).toBe('project-2025')
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })

    it('should handle special characters', () => {
      expect(slugify('Café & Restaurant')).toBe('caf-restaurant')
      expect(slugify('100% Completed!')).toBe('100-completed')
    })
  })

  describe('timeAgo', () => {
    const timeAgo = (date: Date) => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diff < 60) return 'Zojuist'
      if (diff < 3600) return `${Math.floor(diff / 60)}m geleden`
      if (diff < 86400) return `${Math.floor(diff / 3600)}u geleden`
      return `${Math.floor(diff / 86400)}d geleden`
    }

    it('should return "Zojuist" for recent times', () => {
      const now = new Date()
      expect(timeAgo(now)).toBe('Zojuist')
    })

    it('should return minutes for times < 1 hour', () => {
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000)
      expect(timeAgo(thirtyMinsAgo)).toBe('30m geleden')
    })

    it('should return hours for times < 1 day', () => {
      const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000)
      expect(timeAgo(fiveHoursAgo)).toBe('5u geleden')
    })

    it('should return days for older times', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      expect(timeAgo(threeDaysAgo)).toBe('3d geleden')
    })
  })
})

describe('Data Validation', () => {
  describe('Property validation', () => {
    interface PropertyData {
      name: string
      city: string
      postcode?: string
    }

    const validateProperty = (data: PropertyData) => {
      const errors: string[] = []
      if (!data.name || data.name.length < 2) errors.push('Name is required')
      if (!data.city || data.city.length < 2) errors.push('City is required')
      if (data.postcode && !/^\d{4}\s?[A-Z]{2}$/i.test(data.postcode)) {
        errors.push('Invalid Dutch postcode')
      }
      return { valid: errors.length === 0, errors }
    }

    it('should validate correct property data', () => {
      const result = validateProperty({
        name: 'Villa Zonneweide',
        city: 'Almere',
        postcode: '1234 AB',
      })
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid property data', () => {
      const result = validateProperty({
        name: '',
        city: 'A',
        postcode: '12345',
      })
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('Document validation', () => {
    const ALLOWED_MIME_TYPES = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ]
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

    const validateDocument = (file: { mimeType: string; size: number }) => {
      const errors: string[] = []
      if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
        errors.push('Invalid file type')
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push('File too large')
      }
      return { valid: errors.length === 0, errors }
    }

    it('should accept valid documents', () => {
      const result = validateDocument({
        mimeType: 'application/pdf',
        size: 5 * 1024 * 1024,
      })
      expect(result.valid).toBe(true)
    })

    it('should reject invalid mime types', () => {
      const result = validateDocument({
        mimeType: 'application/exe',
        size: 1024,
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid file type')
    })

    it('should reject files that are too large', () => {
      const result = validateDocument({
        mimeType: 'application/pdf',
        size: 15 * 1024 * 1024,
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('File too large')
    })
  })
})

describe('Security Utilities', () => {
  describe('Password validation', () => {
    const validatePassword = (password: string) => {
      const errors: string[] = []
      if (password.length < 8) errors.push('Password must be at least 8 characters')
      if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase')
      if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase')
      if (!/[0-9]/.test(password)) errors.push('Password must contain number')
      if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character')
      return { valid: errors.length === 0, errors }
    }

    it('should accept strong passwords', () => {
      const result = validatePassword('Demo1234!')
      expect(result.valid).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(validatePassword('123').valid).toBe(false)
      expect(validatePassword('password').valid).toBe(false)
      expect(validatePassword('PASSWORD123').valid).toBe(false)
    })
  })

  describe('Token generation', () => {
    const generateToken = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    it('should generate tokens of correct length', () => {
      const token = generateToken()
      expect(token.length).toBe(32)
    })

    it('should generate unique tokens', () => {
      const tokens = new Set<string>()
      for (let i = 0; i < 100; i++) {
        tokens.add(generateToken())
      }
      expect(tokens.size).toBe(100) // All should be unique
    })
  })
})
