import { Session } from "next-auth";

export interface ClientSession extends Session {
  access_token: string;
  id_token: string;
}
