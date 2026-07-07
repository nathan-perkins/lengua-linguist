import { validateLink } from './validateLink'

describe('validateLink', () => {
  it('returns invalid for plain text queries', () => {
    const result = validateLink('learn Spanish pronunciation')

    expect(result.isValid).toBe(false)
  })

  it('returns valid for a normal YouTube watch URL', () => {
    const result = validateLink('https://www.youtube.com/watch?v=ScMzIvxBSi4')
    
    expect(result).toEqual({
      isValid: true,
      isEmbed: false
    })
  })

  it('returns valid and marks embed links as embed', () => {
    const result = validateLink('https://www.youtube.com/embed/ScMzIvxBSi4?si=8hu9E7y91qNDbxdE')

    expect(result).toEqual({
      isValid: true,
      isEmbed: true
    })
  })
})
