import Axios, { AxiosInstance } from 'axios'
import { IStackInfo } from '../interfaces/portainer/response/IStackInfo'
import { IWebhookStack } from '../interfaces/portainer/IWebhookStack'
import Locals from './Locals'

class Portainer {
  public static readonly instance: Portainer = new Portainer()

  private readonly axios: AxiosInstance = Axios.create()

  public static init(): void {
    this.instance.init()
  }

  private init(): void {
    const { portainerHost, portainerApiKey } = Locals.configs

    this.axios.defaults.baseURL = portainerHost
    this.axios.defaults.headers.common['X-API-Key'] = portainerApiKey
  }

  async info(): Promise<object> {
    const resp = await this.axios.get('/api/system/info')
    return resp.data
  }

  async listWebhookStacks(): Promise<IWebhookStack[]> {
    const resp = await this.axios.get<IStackInfo[]>('/api/stacks')

    return resp.data
      .filter(stack => stack.AutoUpdate && stack.GitConfig?.URL)
      .map(stack => ({
        id: stack.Id,
        webhookId: stack.AutoUpdate.Webhook,
        gitUrl: stack.GitConfig!.URL,
        files: [stack.EntryPoint, ...(stack.AdditionalFiles ?? [])],
      }))
  }

  async callStackWebhook(webhookId: string): Promise<void> {
    await this.axios.post(`/api/stacks/webhooks/${webhookId}`)
  }
}

export default Portainer
