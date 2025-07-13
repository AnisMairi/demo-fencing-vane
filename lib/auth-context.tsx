"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { jwtDecode } from "jwt-decode"

export type UserRole = "local_contact" | "coach" | "administrator"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  refreshAccessToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    const accessToken = localStorage.getItem("access_token")
    let logoutTimeout: number | null = null

    if (savedUser && accessToken) {
      try {
        const decoded: any = jwtDecode(accessToken)
        // Check if token is expired
        const now = Date.now() / 1000
        if (decoded.exp && decoded.exp < now) {
          // Try to refresh the token using the cookie
          refreshAccessToken().then((success) => {
            if (!success) {
              logout()
            }
          })
        } else {
          setUser(JSON.parse(savedUser))
          // Set up auto-logout when token expires
          if (decoded.exp) {
            const msUntilExpiry = (decoded.exp - now) * 1000
            logoutTimeout = setTimeout(() => {
              refreshAccessToken().then((success) => {
                if (!success) {
                  logout()
                }
              })
            }, msUntilExpiry)
          }
        }
      } catch (e) {
        logout()
      }
    }
    setIsLoading(false)
    return () => {
      if (logoutTimeout) clearTimeout(logoutTimeout)
    }
  }, [])

  // Refresh token logic - now uses cookies automatically
  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Include credentials to send cookies
        credentials: "include",
      })
      
      if (!response.ok) {
        logout()
        return false
      }
      
      const data = await response.json()
      localStorage.setItem("access_token", data.access_token)
      
      // Optionally update user info
      const decoded: any = jwtDecode(data.access_token)
      const userInfo: User = {
        id: decoded.sub || "",
        email: decoded.email || "",
        name: decoded.email ? decoded.email.split("@")[0] : "",
        role: decoded.role || "local_contact",
      }
      setUser(userInfo)
      localStorage.setItem("user", JSON.stringify(userInfo))
      return true
    } catch (e) {
      logout()
      return false
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        // Include credentials to receive cookies
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.detail === "Incorrect email or password") {
          throw new Error("wrong_credentials")
        } else if (errorData.detail && errorData.detail.toLowerCase().includes("not active")) {
          throw new Error("account_suspended")
        } else {
          throw new Error(errorData.detail || "Login failed")
        }
      }

      const data = await response.json()
      // Save only access token (refresh token is in cookie)
      localStorage.setItem("access_token", data.access_token)

      // Decode JWT to get user info
      const decoded: any = jwtDecode(data.access_token)
      const userInfo: User = {
        id: decoded.sub || "",
        email: decoded.email || email,
        name: decoded.email ? decoded.email.split("@")[0] : email.split("@")[0],
        role: decoded.role || "local_contact",
      }
      setUser(userInfo)
      localStorage.setItem("user", JSON.stringify(userInfo))
    } catch (err) {
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint to clear refresh token cookie
      await fetch("http://localhost:8000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (e) {
      // Continue with logout even if API call fails
      console.error("Logout API call failed:", e)
    }
    
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    // Note: refresh token is cleared by the server via cookie
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, refreshAccessToken }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
