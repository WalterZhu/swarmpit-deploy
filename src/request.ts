import axios from 'axios';

/**
 * 封装 axios 请求
 * @param {string} baseURL 请求地址
 * @param {object} headers 请求头
 * @returns {Promise<any>} 返回 Promise 对象
 */

export async function request(baseURL: string, headers: object): Promise<any> {
  try {
    const res = await axios.get(baseURL, { headers , timeout: 5000});
    return res;
  } catch (error)  {
    throw error;
  }
}
