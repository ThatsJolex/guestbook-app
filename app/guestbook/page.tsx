/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"

type Entry = {
  entryId: string
  name: string
  message: string
  createdAt: number
}

export default function GuestbookPage() {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEntries = async () => {
    try {
      const response = await fetch(
        "/api/guestbook"
      )

      const data = await response.json()

      const sortedEntries = data.sort(
        (a: Entry, b: Entry) =>
          b.createdAt - a.createdAt
      )

      setEntries(sortedEntries)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim())
      return

    try {
      setLoading(true)

      const response = await fetch(
        "/api/guestbook",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            message,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(
          "Failed to create entry"
        )
      }

      setName("")
      setMessage("")

      fetchEntries()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Guestbook</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            padding: "12px",
          }}
        />

        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          style={{
            padding: "12px",
            minHeight: "120px",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "12px",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Submitting..."
            : "Sign Guestbook"}
        </button>
      </div>

      <div>
        <h2>Entries</h2>

        {entries.length === 0 && (
          <p>No entries yet.</p>
        )}

        {entries.map((entry) => (
          <div
            key={entry.entryId}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
            }}
          >
            <h3>{entry.name}</h3>

            <p>{entry.message}</p>

            <small>
              {new Date(
                entry.createdAt
              ).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  )
}