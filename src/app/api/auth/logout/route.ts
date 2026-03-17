import { ClientSession } from "@/types/client-session";
import { getServerSession } from "next-auth";
import { env } from "next-runtime-env";
import authOptions from "../[...nextauth]/auth-options";

export async function GET() {

  const session: ClientSession | null = await getServerSession(authOptions);

  if (session) {
    const idToken = session.id_token;
    const url = `${env('NEXTAUTH_LOGOUT')}?id_token_hint=${idToken}&post_logout_redirect_uri=${env('NEXTAUTH_URL')}`;
    try {
      await fetch(url, { method: "GET" });
    } catch {
      return new Response('Logout failed', { status: 500 });
    }
    return new Response('Success', { status: 200 });
  }

}
