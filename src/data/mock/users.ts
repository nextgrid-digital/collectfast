export type UserRole = 'founder' | 'accountant' | 'admin' | 'viewer'

export type User = {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  companyIds: string[] // Companies this user has access to
  defaultCompanyId: string
  isAccountant: boolean
}

export const users: User[] = [
  {
    id: 'user-john-smith',
    name: 'John Smith',
    email: 'john.smith@techstart.com',
    avatar: '/avatars/john-smith.jpg',
    role: 'founder',
    companyIds: ['techstart-001'],
    defaultCompanyId: 'techstart-001',
    isAccountant: false,
  },
  {
    id: 'user-sarah-johnson',
    name: 'Sarah Johnson',
    email: 'sarah@greenleaf.com',
    avatar: '/avatars/sarah-johnson.jpg',
    role: 'founder',
    companyIds: ['greenleaf-002'],
    defaultCompanyId: 'greenleaf-002',
    isAccountant: false,
  },
  {
    id: 'user-mike-chen',
    name: 'Mike Chen',
    email: 'mike.chen@metrogroup.com',
    avatar: '/avatars/mike-chen.jpg',
    role: 'founder',
    companyIds: ['metro-retail-003'],
    defaultCompanyId: 'metro-retail-003',
    isAccountant: false,
  },
  {
    id: 'user-emma-wilson',
    name: 'Emma Wilson',
    email: 'emma.wilson@accounting.com',
    avatar: '/avatars/emma-wilson.jpg',
    role: 'accountant',
    companyIds: ['techstart-001', 'greenleaf-002', 'metro-retail-003'],
    defaultCompanyId: 'techstart-001',
    isAccountant: true,
  },
]

export const getCurrentUser = (): User => {
  // For prototype: return accountant user by default
  // In real app, this would come from auth context
  return users.find((u) => u.id === 'user-emma-wilson') || users[0]
}

export const getUserById = (id: string): User | undefined => {
  return users.find((u) => u.id === id)
}

export const getUserCompanies = (userId: string): string[] => {
  const user = getUserById(userId)
  return user?.companyIds || []
}

export const getUserByEmail = (email: string): User | undefined => {
  return users.find((u) => u.email === email)
}

