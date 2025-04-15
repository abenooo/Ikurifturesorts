"use client"
import React from 'react';
      import WaitlistForm from './waitlist-form';
import logo from "../images/download1.png"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Globe, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")
    }, 1500)
  }

  return (
    <footer className="w-full">
      {/* CTA Banner */}
      <div className="relative w-full bg-stone-900 py-16">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="Kuriftu Resort"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready for Unforgettable Experiences?</h2>
          <p className="text-stone-300 max-w-2xl mx-auto mb-8">
            Whether you're seeking relaxation, adventure, or cultural immersion, Kuriftu Rewards has the perfect
            experience waiting for you.
          </p>
          <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 rounded-full text-lg">
            Join Kuriftu Rewards
          </Button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Social */}
            <div>
              <div className="flex items-center mb-4">
                <div className="relative h-10 w-32">
                  <Image src={logo} alt="Kuriftu Rewards" fill className="object-contain" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                We're active on social media! Follow us for exclusive offers, travel inspiration, and loyalty program
                updates.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-amber-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-amber-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-amber-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-amber-600 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#membership-tiers" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Membership Tiers
                  </Link>
                </li>
                <li>
                  <Link href="#ai-experience" className="text-gray-600 hover:text-amber-600 transition-colors">
                    AI Experience Builder
                  </Link>
                </li>
                <li>
                  <Link href="#sustainability" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Sustainability Rewards
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-600 hover:text-amber-600 transition-colors">
                    Member Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">Kuriftu Resort & Spa, Bishoftu, Ethiopia</li>
                <li className="text-gray-600">+251 116 670 344</li>
                <li className="text-gray-600">rewards@kuriftu.com</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-4">Subscribe to our newsletter for exclusive offers and updates.</p>
              {isSubmitted ? (
                <div className="flex items-center p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-2" />
                  <p className="text-sm text-emerald-800">Thank you for subscribing!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-12"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="absolute right-1 top-1 h-8 w-8 p-0 bg-amber-600 hover:bg-amber-700"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © Copyright {new Date().getFullYear()}, All Rights Reserved by Kuriftu Resorts & Spa
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-amber-600 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-600 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-600 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

