'use client'

import { useEffect, useState } from 'react'

export function Account({ userId, token }) {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setAccount(null)

    fetch(`/api/accounts/${encodeURIComponent(userId)}`, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch account')
        return response.json()
      })
      .then((value) => {
        if (active) setAccount(value)
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError') setAccount(null)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [userId, token])

  return <div>{account?.description || ''}</div>
}
