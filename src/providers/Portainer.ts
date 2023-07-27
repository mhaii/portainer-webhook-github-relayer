import Axios from 'axios'
import { AxiosInstance } from 'axios'
import { IStackInfo } from '../interfaces/portainer/response/IStackInfo'
import { IWebhookStack } from '../interfaces/portainer/IWebhookStack'

class Portainer {
  public static readonly instance: Portainer = new Portainer()

  private readonly axios: AxiosInstance = Axios.create()

  public static init(): void {
    this.instance.init()
  }

  private init(): void {
    const host = process.env['PORTAINER_HOST']
    const apiKey = process.env['PORTAINER_API_TOKEN']

    this.axios.defaults.baseURL = host
    this.axios.defaults.headers.common['X-API-Key'] = apiKey
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
