"use client"

import ServicesList from "@/components/services-list"
import ServicesShowcase from "@/components/services-showcase"

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Services</h1>
          <ServicesList />
          <div className="mt-12">
            <ServicesShowcase />
          </div>
        </div>
      </div>
    </main>
  )
}