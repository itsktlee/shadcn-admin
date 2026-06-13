import { describe, expect, it } from 'vitest'
import { getDisplayNameInitials, getPageNumbers } from './utils'

describe('getPageNumbers', () => {
  it('returns all pages when total is at most 5', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3])
    expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('shows ellipsis near the beginning', () => {
    expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, '...', 10])
    expect(getPageNumbers(3, 10)).toEqual([1, 2, 3, 4, '...', 10])
  })

  it('shows ellipsis near the end', () => {
    expect(getPageNumbers(10, 10)).toEqual([1, '...', 7, 8, 9, 10])
    expect(getPageNumbers(9, 10)).toEqual([1, '...', 7, 8, 9, 10])
  })

  it('shows ellipsis on both side in the middle', () => {
    expect(getPageNumbers(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10])
  })

  it('handles current page greater than total pages', () => {
    expect(getPageNumbers(6, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPageNumbers(11, 10)).toEqual([1, '...', 7, 8, 9, 10])
  })
})

describe('getDisplayNameInitials', () => {
  it('returns the first two letters for a single-word name', () => {
    expect(getDisplayNameInitials('Template')).toBe('TE')
  })

  it('returns the first and last initials for multi-word names', () => {
    expect(getDisplayNameInitials('Template Admin')).toBe('TA')
    expect(getDisplayNameInitials('  Jane   Doe  ')).toBe('JD')
  })

  it('returns a fallback marker for empty names', () => {
    expect(getDisplayNameInitials('   ')).toBe('?')
  })
})
