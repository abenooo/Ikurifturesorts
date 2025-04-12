"use client"

import AIExperienceBuilder from "@/components/ai-experience-builder"

export default function AIExperiencePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">AI Experience Builder</h1>
          <AIExperienceBuilder />
        </div>
      </div>
    </main>
  )
}