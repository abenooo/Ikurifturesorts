"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/userStore"
import AuthModal from "./auth-modal"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, token, setUser, clearUser } = useUserStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  
  const navbarBg = isScrolled ? "bg-white shadow-md" : "bg-transparent"
  const textColor = isScrolled ? "text-gray-800" : "text-white"
  const isDashboard = pathname === "/dashboard"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Hydrate user from localStorage if exists
    const storedUser = localStorage.getItem("kuriftuUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Access the nested user object
        const actualUser = parsedUser.state?.user?.user || parsedUser.user || parsedUser
        const actualToken = parsedUser.state?.user?.token || parsedUser.token
        if (actualUser) {
          setUser(actualUser, actualToken)
        }
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setUser])

  const handleLogin = (userData: any) => {
    // Normalize the structure before saving
    const userToStore = {
      state: {
        user: {
          user: userData.user || userData,
          token: userData.token
        },
        token: userData.token,
        isHydrated: true
      },
      version: 0
    }
    localStorage.setItem("kuriftuUser", JSON.stringify(userToStore))
    setUser(userData.user || userData, userData.token)
  }

  const handleLogout = () => {
    localStorage.removeItem("kuriftuUser")
    clearUser()
    router.push("/")
  }

  useEffect(() => {
    console.log("Current user:", user)
    console.log("LocalStorage user:", localStorage.getItem("kuriftuUser"))
  }, [user])



  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-32">
              <Image src="https://imgs.search.brave.com/5yZpZgY7fxZbMon2wonPZpeWTEF06hWHW-6dkH8Bn8A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dGhlb3JnLmNvbS85/OTI4ZmJjZS1hMGY2/LTRmM2UtOWJhMS01/YWQ1YWFkNzJkMzFf/dGh1bWIuanBn" alt="Kuriftu Rewards" fill className="object-contain" />
            </div>
            <span className={`ml-2 font-semibold ${isDashboard || isScrolled ? "text-amber-800" : "text-white"}`}>
              Rewards
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/membership" className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}>
              Membership Tiers
            </Link>
            <Link href="/services" className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}>
              Services
            </Link>
            <Link href="/ai-experience" className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}>
              AI Experience
            </Link>
            <Link href="/sustainability" className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}>
              Sustainability
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className={`font-medium hover:text-amber-600 transition-colors ${textColor}`}>
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                    <User className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-800">
                      {(user.loyaltyPoints || 0).toLocaleString()} points
                    </span>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="h-8">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link
                onClick={() => setIsAuthModalOpen(true)}
                href=""
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-full transition-colors"
              >
                Join Now
              </Link>
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
              <Link href="/membership" className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Membership Tiers
              </Link>
              <Link href="/services" className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
              <Link href="/ai-experience" className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                AI Experience
              </Link>
              <Link href="/sustainability" className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Sustainability
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="font-medium text-gray-800 hover:text-amber-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
                      <User className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-800">
                        {(user.loyaltyPoints || 0).toLocaleString()} points
                      </span>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="h-8">
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Link
                  href=""
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-full transition-colors inline-block text-center"
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
  )
}