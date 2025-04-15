"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserStore, rehydrateStore } from "@/store/userStore"
import AuthModal from "./auth-modal"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, token, setUser, clearUser } = useUserStore()

  // Clean white background with blur effect
  const navbarBg = "bg-white/80 backdrop-blur-md"
  const textColor = "text-gray-800"
  const isDashboard = pathname === "/dashboard"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Rehydrate store on mount
    rehydrateStore()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData.user || userData, userData.token)
  }

  const handleLogout = () => {
    clearUser()
    router.push("/")
  }

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />

      {/* Update header positioning */}
      <header className="fixed top-3 left-0 right-0 z-50 transition-all duration-300">
        <div
          className={`max-w-4xl mx-auto px-4 py-3 md:mt-2 md:rounded-full md:border md:border-gray-200 md:shadow-sm ${navbarBg}`}
        >
          <div className="flex items-center justify-between relative">
            {/* Logo section - left aligned with circular image like in screenshot */}
            <Link href="/" className="flex items-center z-10 pr-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src="https://imgs.search.brave.com/5yZpZgY7fxZbMon2wonPZpeWTEF06hWHW-6dkH8Bn8A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dGhlb3JnLmNvbS85/OTI4ZmJjZS1hMGY2/LTRmM2UtOWJhMS01/YWQ1YWFkNzJkMzFf/dGh1bWIuanBn"
                  alt="Kuriftu Rewards"
                  fill
                  className="object-cover"
                />
              </div>
              <span className={`ml-2 text-sm font-medium ${textColor}`}>Kuriftu Rewards</span>
            </Link>

            {/* Desktop Navigation - right aligned with clean spacing like in screenshot */}
            <nav className="hidden md:flex items-center space-x-6 z-10 pl-2">
              <Link
                href="/membership"
                className={`text-sm font-medium hover:text-gray-600 transition-colors ${textColor}`}
              >
                Membership
              </Link>
              <Link
                href="/services"
                className={`text-sm font-medium hover:text-gray-600 transition-colors ${textColor}`}
              >
                Services
              </Link>
              <Link
                href="/ai-experience"
                className={`text-sm font-medium hover:text-gray-600 transition-colors ${textColor}`}
              >
                AI Experience
              </Link>
              <Link
                href="/sustainability"
                className={`text-sm font-medium hover:text-gray-600 transition-colors ${textColor}`}
              >
                Sustainability
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium hover:text-gray-600 transition-colors ${textColor}`}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                      <User className="h-3 w-3 text-gray-600" />
                      <span className="text-xs font-medium text-gray-800">
                        {(user.loyaltyPoints || 0).toLocaleString()}
                      </span>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="h-7 text-xs px-2 rounded-full">
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Link
                  onClick={() => setIsAuthModalOpen(true)}
                  href=""
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium py-1.5 px-3 rounded-full transition-colors"
                >
                  Join Now
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden z-10 pl-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5 text-gray-800" /> : <Menu className="h-5 w-5 text-gray-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden mt-2 rounded-lg border border-gray-200 shadow-sm ${navbarBg}`}>
            <div className="max-w-4xl mx-auto px-4 py-3">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/membership"
                  className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Membership
                </Link>
                <Link
                  href="/services"
                  className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/ai-experience"
                  className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AI Experience
                </Link>
                <Link
                  href="/sustainability"
                  className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sustainability
                </Link>

                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                        <User className="h-3 w-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-800">
                          {(user.loyaltyPoints || 0).toLocaleString()} points
                        </span>
                      </div>
                      <Button variant="outline" onClick={handleLogout} className="h-7 text-xs">
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <Link
                    href=""
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium py-1.5 px-3 rounded-full transition-colors inline-block w-fit"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Join Now
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
