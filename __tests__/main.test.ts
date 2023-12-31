/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import { get } from 'http'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/

// Mock the GitHub Actions core library
let debugMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance

describe('action test', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('input swarmpit_uri must be uri string', async () => {
    getInputMock.mockReturnValueOnce('swarmpit:8888')
    await main.run()
    expect(setFailedMock).toHaveBeenCalledWith(
      'swarmpit_host is not a valid url'
    )
  })

  it('input swarmpit_token must be string', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'swarmpit_uri':
          return 'http://swarmpit.com:8888'
        case 'swarmpit_token':
          return 'ifQ.C0wzNMJE6ZnaftTK8EEyPv4uT3p6VHBk1S-Ekn3mJaY'
        default:
          return ''
      }
    })
    await main.run()
    expect(setFailedMock).toHaveBeenCalledWith(
      'swarmpit_token is not a valid token'
    )
  })
})
