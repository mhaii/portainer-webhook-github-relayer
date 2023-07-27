import Portainer from '../providers/Portainer'
import { IGithubRequest } from '../interfaces/github/request/IGithubRequest'
import { IWebhookStack } from '../interfaces/portainer/IWebhookStack'
import Log from '../middlewares/Log'
import { Request, Response } from 'express'

class Main {
  public static async index(req: Request, res: Response) {
    void Main.execute(req.body)
    return res.json({})
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
      Log.error(`Stack ${stack.id} failed to update, error message is ${err.message}`)
    })
  }
}

export default Main
