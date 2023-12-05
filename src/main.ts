import * as core from '@actions/core'
import { request } from './request'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const uri: string = core.getInput('swarmpit_host')
    const token: string = core.getInput('swarmpit_token')
    let service_id: string = core.getInput('service_id')
    const service_name: string = core.getInput('service_name')
    const headers = {
      authorization: token,
      'Accept': 'application/json',
    }
    if (!service_id && !service_name) {
      core.setFailed('cannot find service_id or service_name')
    }
    if (!service_id) {
      const service_list_url = `${uri}/api/services`
      const services = await request(service_list_url, headers)
      const service = services.data.find((item: any) => item.serviceName === service_name)
      if (!service) {
        core.setFailed(`cannot find service ${service_name}`)
      }
      service_id = service.id
    }
    const service_compose_url = `${uri}/api/services/${service_id}/compose`
    const result = await request(service_compose_url, headers)
    core.setOutput('compose', result.data.compose)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
