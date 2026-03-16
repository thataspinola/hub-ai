'use client'

import { signIn, signOut, useSession } from 'next-auth/react';

async function keycloakSessionLogout(): Promise<void> {
  try {
    await fetch('/react-ssr-corp-hubv-painel-administrativo/api/auth/logout', { method: 'GET' });
  } catch (err) {
    console.error(err);
  }
}

export default function Auth() {

  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span>Loading...</span>
    )
  } else if (session) {
    return (
      <span onClick={() => keycloakSessionLogout().then(() => signOut({ callbackUrl: "/react-ssr-corp-hubv-painel-administrativo" }))}>Logout</span>
    )
  } else {
    return (
      <span onClick={() => signIn("keycloak")}>Login</span>
    )
  }
}
