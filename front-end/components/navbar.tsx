"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, User } from "lucide-react"

interface UserData {
  name: string
  email: string
  points: number
  tier: string
  joinDate: string
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Check for logged in user
    const storedUser = localStorage.getItem("kuriftuUser")
    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isDashboard = pathname === "/dashboard"
  const navbarBg = isDashboard
    ? "bg-white shadow-md py-2"
    : isScrolled
      ? "bg-white shadow-md py-2"
      : "bg-transparent py-4"

  const textColor = isDashboard || isScrolled ? "text-gray-800" : "text-white"

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-32">
              <Image src="../images/download.jpeg" alt="Kuriftu Rewards" fill className="object-contain" />
          
            </div>
            <span className={`ml-2 font-semibold ${isDashboard || isScrolled ? "text-amber-800" : "text-white"}`}>
              Rewards
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {userData ? (
              <>
                <Link href="/dashboard" className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}>
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                  <User className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-gray-800">{userData.points.toLocaleString()} points</span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="#membership-tiers"
                  className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}
                >
                  Membership Tiers
                </Link>
                <Link
                  href="#services"
                  className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}
                >
                  Services
                </Link>
                <Link
                  href="#ai-experience"
                  className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}
                >
                  AI Experience
                </Link>
                <Link
                  href="#sustainability"
                  className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}
                >
                  Sustainability
                </Link>
                <Link
                  href="#join-now"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-full transition-colors"
                >
                  Join Now
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className={isDashboard || isScrolled ? "text-gray-800" : "text-white"} />
            ) : (
              <Menu className={isDashboard || isScrolled ? "text-gray-800" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {userData ? (
                <>
                  <Link
                    href="/dashboard"
                    className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
                    <User className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-800">{userData.points.toLocaleString()} points</span>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="#membership-tiers"
                    className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Membership Tiers
                  </Link>
                  <Link
                    href="#services"
                    className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    href="#ai-experience"
                    className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    AI Experience
                  </Link>
                  <Link
                    href="#sustainability"
                    className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sustainability
                  </Link>
                  <Link
                    href="#join-now"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-full transition-colors inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
