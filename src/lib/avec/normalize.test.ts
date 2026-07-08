import { describe, expect, it } from 'vitest'
import { normalizePhone } from '@/lib/avec/normalize'

describe('normalizePhone', () => {
  it('normaliza celular BR com DDD', () => {
    expect(normalizePhone('(11) 99999-8888')).toBe('+5511999998888')
  })

  it('mantém número já com código do país', () => {
    expect(normalizePhone('+5511988887777')).toBe('+5511988887777')
  })

  it('retorna null para número curto', () => {
    expect(normalizePhone('12345')).toBeNull()
  })
})
