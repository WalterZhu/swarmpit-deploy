import * as core from '@actions/core'
import axios from 'axios'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // 获取访问 swarmpit 的地址，如果没有设置则报错
    const uri: string = core.getInput('swarmpit_host')
    if (!uri) {
      core.setFailed('cannot find swarmpit_host')
    }
    core.debug(`uri: ${uri}`)

    // 获取访问 swarmpit 的 token，如果没有设置则报错
    const token: string = core.getInput('swarmpit_token')
    if (!token) {
      core.setFailed('cannot find swarmpit_token')
    }
    core.debug(`token: ----`)

    // 获取 service_id 或 service_name，如果都没有设置则报错
    let service_id: string = core.getInput('service_id')
    const service_name: string = core.getInput('service_name')
    const headers = {
      authorization: token,
      'Accept': 'application/json',
    }
    if (!service_id && !service_name) {
      core.setFailed('cannot find service_id or service_name')
    }
    // 如果没有设置 service_id，则通过 service_name 获取 service_id, 如果没有找到则报错
    if (!service_id) {
      const service_list_url = `${uri}/api/services`
      const services = await axios.get(service_list_url, { headers, timeout: 5000 })
      const service = services.data.find((item: any) => item.serviceName === service_name)
      if (!service) {
        core.setFailed(`cannot find service ${service_name}`)
      }
      service_id = service.id
    }
    core.debug(`service_id: ${service_id}`)

    // 获取部署的tag
    let params = {}
    const tag: string = core.getInput('tag')
    if (tag) {
      core.debug(`tag: ${tag}`)
      params = { tag : tag }
    }

    // 通过 service_id 调用redeploy接口
    const redeploy_url = `${uri}/api/services/${service_id}/redeploy`
    const result = await axios.post(redeploy_url, { params: params ,headers: headers, timeout: 5000 })
    if (result.status === 202) {
      core.info(`redeploy service ${service_id} success`)
    } else {
      core.setFailed(`redeploy service ${service_id} failed`)
    }
    // 
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
