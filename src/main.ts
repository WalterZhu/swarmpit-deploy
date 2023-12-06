import * as core from '@actions/core'
import axios from 'axios'
import validator from 'validator'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // 获取访问 swarmpit 的地址，如果没有设置则报错
    const uri: string = core.getInput('swarmpit_uri').trim()
    if (!validator.isURL(uri)) {
      core.setFailed('swarmpit_host is not a valid url')
    }
    core.debug(`Swarmpit URI is: ${uri}`)

    // 获取访问 swarmpit 的 token，如果没有设置则报错
    const token: string = core.getInput('swarmpit_token').trim()
    if (!validator.matches(token, /^Bearer\s.*/)) {
      core.setFailed('swarmpit_token is not a valid token')
    }
    core.debug(`token has seted`)

    // 设置请求头
    const headers = {
      authorization: token,
      Accept: 'application/json'
    }

    // 获取swarm集群部署的所有service list
    const service_list_url = `${uri}/api/services`.replace(/([^:]\/)\/+/g, '$1')
    core.debug(`service list url: ${service_list_url}`)
    const services = await axios.get(service_list_url, {
      headers: headers,
      timeout: 5000
    })

    let compose_service_id: string = ''
    // 获取service_id，如有则检查是否存在与service list
    const service_id: string = core.getInput('service_id').trim()
    if (service_id) {
      const service = services.data.find((item: any) => item.id === service_id)
      if (!service) {
        core.info(`cannot find service ${service_id}`)
      }
      compose_service_id = service.id
    }

    // 如果没有找到id对应的service，则通过 service_name 查找
    if (compose_service_id === '') {
      // 获取service_name，如有则检查是否存在与service list
      const service_name: string = core.getInput('service_name').trim()
      if (service_name) {
        const service = services.data.find(
          (item: any) => item.serviceName === service_name
        )
        if (!service) {
          core.info(`cannot find service ${service_name}`)
        }
        compose_service_id = service.id
      }
    }

    // 如果仍然没有找到, 则失败报错
    if (compose_service_id === '') {
      core.setFailed('cannot find service')
    }

    // 获取部署的tag
    let params: any = {}
    const tag: string = core.getInput('tag').trim()
    if (tag) {
      core.debug(`tag: ${tag}`)
      params = { tag: tag }
    }

    // 通过 service_id 调用redeploy接口
    const redeploy_url =
      `${uri}api/services/${compose_service_id}/redeploy`.replace(
        /([^:]\/)\/+/g,
        '$1'
      )
    core.debug(`redeploy url: ${redeploy_url}`)
    const result = await axios.post(redeploy_url, null, {
      params: params,
      headers: headers,
      timeout: 5000
    })
    if (result.status === 202) {
      core.info(`redeploy service ${service_id} success`)
    } else {
      core.setFailed(`redeploy service ${service_id} failed`)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
