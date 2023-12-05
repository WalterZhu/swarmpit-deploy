/**
 * Unit tests for src/wait.ts
 */

import exp from 'constants'
import { request } from '../src/request'
import { expect } from '@jest/globals'

describe('requset.ts', () => {
  it('输入一个错误URL超时', async () => {
    const url = 'http://localhost:8080/api/services'
    const headers = {
      Accept: 'application/json',
    }
    const start = new Date()
    //await expect(request(url, headers)).rejects.toThrow('timeout of 5000ms exceeded')
    await request(url, headers)
    const end = new Date()

    expect(end.getTime() - start.getTime()).toBeGreaterThan(4500)
  })
})
