export interface IGithubRequest {
  repository: {
    clone_url: string
  }
  commits: {
    added: string[]
    removed: string[]
    modified: string[]
  }[]
}
