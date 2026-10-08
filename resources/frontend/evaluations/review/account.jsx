'use client'
import { useEffect, useState } from 'react'
export function Account({ userId, token }) {
  const [account, setAccount] = useState(null)
  useEffect(() => {
    console.log('Credential:', token)
    fetch(`/api/accounts/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => response.json()).then(setAccount)
  }, [])
  return <div dangerouslySetInnerHTML={{ __html: account?.description || '' }} />
}
