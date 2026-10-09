import { Session } from 'next-auth'

export interface ClientSession extends Session {
  roles?: string[]
  error?: string
  access_token: string
  id_token: string
}
