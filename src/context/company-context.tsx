import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { type Company } from '@/data/mock/companies'
import { getCompanyById } from '@/data/mock/companies'
import { getCurrentUser, getUserByEmail, users, type User } from '@/data/mock/users'
import { useAuthStore } from '@/stores/auth-store'

interface CompanyContextType {
  currentCompany: Company | null
  companies: Company[]
  user: User | null
  switchCompany: (companyId: string) => void
  isLoading: boolean
  isAccountant: boolean
  canManageUsers: boolean
  canEditSettings: boolean
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

const STORAGE_KEY = 'collectfast_current_company_id'

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const { auth } = useAuthStore()

  // Get current user and their companies
  const userCompanies = useMemo(() => {
    if (!user) return []
    
    return user.companyIds
      .map((id) => getCompanyById(id))
      .filter((company): company is Company => company !== undefined)
  }, [user])

  // Initialize: Load user and set default company
  useEffect(() => {
    const initialize = () => {
      setIsLoading(true)
      
      // Get current user from auth store if available, otherwise use default
      let currentUser: User | null = null
      
      if (auth.user?.email) {
        // Try to find user by email from auth store
        const foundUser = getUserByEmail(auth.user.email)
        if (foundUser) {
          currentUser = foundUser
        }
      }
      
      // If no user found from auth store, check localStorage for accountant flag
      if (!currentUser) {
        const isAccountant = localStorage.getItem('collectfast_is_accountant') === 'true'
        
        if (isAccountant) {
          // For prototype: if accountant flag is set, use accountant user
          currentUser = users.find((u) => u.isAccountant) || null
        } else {
          // Fallback to default
          currentUser = getCurrentUser()
        }
      }
      
      if (currentUser) {
        setUser(currentUser)

        // Try to load saved company from localStorage
        const savedCompanyId = localStorage.getItem(STORAGE_KEY)
        
        // Validate saved company is accessible to user
        const validSavedCompany = savedCompanyId && 
          currentUser.companyIds.includes(savedCompanyId)
          ? savedCompanyId
          : null

        // Set current company: saved > default > first available
        const defaultCompanyId = validSavedCompany ||
          currentUser.defaultCompanyId ||
          currentUser.companyIds[0] ||
          null

        if (defaultCompanyId) {
          setCurrentCompanyId(defaultCompanyId)
          localStorage.setItem(STORAGE_KEY, defaultCompanyId)
        }
      }

      setIsLoading(false)
    }

    initialize()
  }, [auth.user])

  const currentCompany = useMemo(() => {
    if (!currentCompanyId) return null
    return getCompanyById(currentCompanyId) || null
  }, [currentCompanyId])

  const switchCompany = useCallback((companyId: string) => {
    // Validate user has access to this company
    if (!user || !user.companyIds.includes(companyId)) {
      console.warn('User does not have access to company:', companyId)
      return
    }

    const company = getCompanyById(companyId)
    if (!company) {
      console.warn('Company not found:', companyId)
      return
    }

    setCurrentCompanyId(companyId)
    localStorage.setItem(STORAGE_KEY, companyId)
  }, [user])

  const isAccountant = user?.isAccountant || false
  const canManageUsers = user?.role === 'admin' || user?.role === 'founder'
  const canEditSettings = user?.role === 'admin' || user?.role === 'founder'

  const value: CompanyContextType = {
    currentCompany,
    companies: userCompanies,
    user,
    switchCompany,
    isLoading,
    isAccountant,
    canManageUsers,
    canEditSettings,
  }

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  )
}

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}

