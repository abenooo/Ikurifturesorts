"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    if (!name) {
      setError("Please enter your name")
      return
    }

    setError("")
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="bg-stone-800 border border-stone-700 rounded-lg p-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
        <p className="text-stone-300">
          Thank you for joining our waitlist. We'll notify you when Kuriftu Rewards launches.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-stone-300">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="bg-stone-800 border-stone-700 text-white"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-stone-300">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="bg-stone-800 border-stone-700 text-white"
        />
      </div>

      {error && <div className="text-amber-400 text-sm">{error}</div>}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 hover:bg-amber-700">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          "Join Waitlist"
        )}
      </Button>

      <p className="text-xs text-stone-400 text-center">
        By joining, you agree to receive updates about Kuriftu Rewards. We respect your privacy and will never share
        your information.
      </p>
    </form>
  )
}
