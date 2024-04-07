import Portainer from '../providers/Portainer'
import { IGithubRequest } from '../interfaces/github/request/IGithubRequest'
import { IWebhookStack } from '../interfaces/portainer/IWebhookStack'
import Log from '../middlewares/Log'
import { Request, Response } from 'express'
import Locals from '../providers/Locals'
import Http from '../middlewares/Http'

class Main {
  public static async healthCheck(req: Request, res: Response) {
    try {
      const portainerStatus = await Portainer.instance.info()
      Log.info(`Portainer status: ${JSON.stringify(portainerStatus)}`)
      return res.json({ message: 'OK' })
    } catch (e) {
      Log.error(JSON.stringify(e))
      return res.json({ message: e.message }).status(500)
    }
  }

  public static async webhook(req: Request, res: Response) {
    const webhookSecret = Locals.configs.githubWebhookSecret
    if (webhookSecret) {
      const isValid = Http.validateWebhook(
        webhookSecret,
        req.body,
        req.headers['x-hub-signature-256'] as string,
      )

      if (!isValid) {
        Log.error('Webhook triggered but contains invalid signature')
        return res.status(401).send({ error: 'Unauthorized' })
      }
    }

    void Main
      .execute(req.body)
      .catch((e) => {
        Log.error(JSON.stringify(e))
      })
    return res.json({ message: 'OK' })
  }

  private static async execute(param: IGithubRequest): Promise<any> {
    const repoUrl = param.repository.clone_url

    const filesChanged = Array.from(
      new Set(
        param.commits.reduce(
          (acc, cur) => [...acc, ...cur.added, ...cur.removed, ...cur.modified],
          [] as string[],
        ),
      ),
    )

    Log.info(`Got update from ${repoUrl}, files changed: ${JSON.stringify(filesChanged)}`)

    const stacks = await Portainer.instance.listWebhookStacks()

    const stackNeededToCall = stacks
      .filter(stack => stack.gitUrl === repoUrl)
      .filter(stack => stack.files.filter(file => filesChanged.includes(file)).length)

    Log.info(`Updating stack ${JSON.stringify(stackNeededToCall.map(stack => stack.id))}`)

    const failedStacks: { stack: IWebhookStack, err: Error }[] = []

    const updatePromises = stackNeededToCall
      .map(stack =>
        Portainer.instance
          .callStackWebhook(stack.webhookId)
          .catch((err) => {
            failedStacks.push({ stack, err })
          }),
      )

    await Promise.all(updatePromises)

    Log.info(`Updated ${stackNeededToCall.length} stacks, ${stackNeededToCall.length - failedStacks.length} success, ${failedStacks.length} failed`)
    failedStacks.forEach(({ stack, err }) => {
      const errorMsg = (err as any).response?.data?.details
      if (errorMsg) {
        const errors = errorMsg.split('\n').map(msg => msg.trim()).filter(msg => msg)
        Log.error(`Stack ${stack.id} failed to update, error message is ${JSON.stringify(errors)}`)
      } else {
        Log.error(`Stack ${stack.id} failed to update, error message is ${err.message}`)
      }
    })
  }
}

export default Main
