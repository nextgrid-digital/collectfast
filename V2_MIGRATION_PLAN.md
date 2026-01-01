# V2 Multi-Tenant Architecture - Prototype Implementation Plan

## Overview

This document outlines the plan to adapt the current Collectfast prototype UI to demonstrate multi-tenant architecture concepts. This is a **prototype/demo version** with sample data and no real authentication - designed for clicking through and showcasing features.

---

## 🎯 Goals

1. **Visual Demonstration**: Show how accountants can manage multiple SMB clients
2. **Company Switching**: Demonstrate seamless switching between companies
3. **Role-Based Views**: Show different experiences for founders vs accountants
4. **Realistic Sample Data**: Create believable multi-company scenarios
5. **Click-Through Demo**: Everything should be interactive and demo-ready

---

## 📋 Current State (Checkpoint)

### What We Have
- ✅ Single-tenant prototype UI
- ✅ Dashboard with metrics
- ✅ Customers, Invoices, Communication, Aging Report pages
- ✅ Sample data for one company
- ✅ Dark theme with Geist fonts
- ✅ No authentication (direct access)

### What We Need
- 🔄 Multi-company sample data
- 🔄 Company switcher component
- 🔄 Company context provider (mock)
- 🔄 Accountant dashboard view
- 🔄 Visual differentiation per company
- 🔄 Role-based UI variations

---

## 🏗️ Architecture Approach (Prototype)

### Simplified Multi-Tenant Model

```
Mock User (1) ───► Companies (N) [via localStorage/cookies]
   ├──► Current Company Context (stored in state)
   ├──► Sample Data per Company (in-memory)
   └──► No Real Authentication (just UI state)
```

### Data Storage Strategy

**For Prototype:**
- All data in TypeScript files (`src/data/mock/`)
- Company context in React Context + localStorage
- No API calls - everything is client-side
- Sample data includes multiple companies with realistic scenarios

---

## 📊 Sample Data Structure

### Companies to Create

1. **TechStart Inc.** (Founder: John Smith)
   - Industry: Software
   - 15 customers, 45 invoices
   - QuickBooks integration
   - Primary color: Blue (#3b82f6)

2. **GreenLeaf Consulting** (Founder: Sarah Johnson)
   - Industry: Consulting
   - 8 customers, 22 invoices
   - Xero integration
   - Primary color: Green (#10b981)

3. **Metro Retail Group** (Founder: Mike Chen)
   - Industry: Retail
   - 25 customers, 78 invoices
   - QuickBooks integration
   - Primary color: Purple (#8b5cf6)

4. **Accountant View** (Accountant: Emma Wilson)
   - Manages all 3 companies above
   - Can switch between them
   - Aggregate dashboard view

### Sample Data Files

```
src/data/mock/
├── companies.ts          # Company definitions
├── users.ts              # User definitions (founders + accountant)
├── company-data/
│   ├── techstart/
│   │   ├── customers.ts
│   │   ├── invoices.ts
│   │   ├── communications.ts
│   │   └── aging-report.ts
│   ├── greenleaf/
│   │   └── ...
│   └── metro-retail/
│       └── ...
└── accountant-data.ts    # Aggregate data for accountant view
```

---

## 🎨 UI Components to Build

### 1. Company Switcher Component

**File:** `src/components/company-switcher.tsx`

**Features:**
- Dropdown/popover with list of companies
- Shows company logo, name, ERP provider
- Color-coded by company primary color
- Quick switch functionality
- Visual indicator of current company

**Design:**
- Located in sidebar header
- Shows current company with avatar/logo
- Click to open dropdown
- Search/filter companies
- "Add Company" option (disabled for demo)

### 2. Company Context Provider

**File:** `src/context/company-context.tsx`

**Purpose:**
- Manage current company state
- Provide company data to all components
- Handle company switching
- Store preference in localStorage

**State:**
```typescript
{
  currentCompany: Company | null
  companies: Company[]
  switchCompany: (id: string) => void
  isAccountant: boolean
  canManageUsers: boolean
}
```

### 3. Company Badge Component

**File:** `src/components/company-badge.tsx`

**Purpose:**
- Show current company context in headers
- Visual differentiation
- Role indicator (Founder/Accountant)

### 4. Accountant Dashboard

**File:** `src/features/collectfast/accountant-dashboard/index.tsx`

**Features:**
- Aggregate metrics across all companies
- Company cards showing:
  - Company name & logo
  - Outstanding amount
  - Overdue invoices count
  - Last activity
- Click company card to switch context
- Color-coded by company

---

## 🔄 Implementation Steps

### Phase 1: Setup Mock Data Infrastructure (Day 1)

#### Step 1.1: Create Company Data Structure
- [ ] Create `src/data/mock/companies.ts` with 3 companies
- [ ] Create `src/data/mock/users.ts` with user definitions
- [ ] Define company access relationships

#### Step 1.2: Create Per-Company Sample Data
- [ ] Generate customers for each company (different names, realistic data)
- [ ] Generate invoices for each company (different amounts, dates)
- [ ] Generate communications for each company
- [ ] Generate aging report data for each company
- [ ] Ensure data feels realistic and varied

#### Step 1.3: Create Data Access Layer
- [ ] Create `src/data/mock/data-service.ts` to fetch data by company
- [ ] Functions like `getCustomersByCompany(companyId)`
- [ ] Functions like `getInvoicesByCompany(companyId)`
- [ ] Aggregate functions for accountant view

**Files to Create:**
```
src/data/mock/
├── companies.ts
├── users.ts
├── data-service.ts
└── company-data/
    ├── techstart/
    │   ├── customers.ts
    │   ├── invoices.ts
    │   ├── communications.ts
    │   └── aging-report.ts
    ├── greenleaf/
    │   └── (same structure)
    └── metro-retail/
        └── (same structure)
```

---

### Phase 2: Company Context System (Day 2)

#### Step 2.1: Create Company Context Provider
- [ ] Create `src/context/company-context.tsx`
- [ ] Implement company state management
- [ ] Add localStorage persistence
- [ ] Add company switching logic
- [ ] Add role detection (founder vs accountant)

#### Step 2.2: Integrate Company Provider
- [ ] Wrap app in `CompanyProvider` in `src/App.tsx` or root route
- [ ] Ensure it loads before other components
- [ ] Set default company on mount

#### Step 2.3: Update Existing Components
- [ ] Update all data fetching to use company context
- [ ] Modify dashboard to use `currentCompany.id`
- [ ] Modify customers page to filter by company
- [ ] Modify invoices page to filter by company
- [ ] Modify communication page to filter by company
- [ ] Modify aging report to filter by company

**Key Changes:**
```typescript
// Before
const customers = customersData

// After
const { currentCompany } = useCompany()
const customers = getCustomersByCompany(currentCompany.id)
```

---

### Phase 3: Company Switcher UI (Day 3)

#### Step 3.1: Build Company Switcher Component
- [ ] Create dropdown/popover UI
- [ ] Show company list with logos
- [ ] Add search functionality
- [ ] Add visual indicators (current, primary)
- [ ] Style with company colors

#### Step 3.2: Integrate into Sidebar
- [ ] Add to `src/components/layout/app-sidebar.tsx`
- [ ] Position in sidebar header
- [ ] Handle collapsed state
- [ ] Add role badge below switcher

#### Step 3.3: Add Company Badge
- [ ] Create company badge component
- [ ] Add to page headers
- [ ] Show in main content area (optional)
- [ ] Style with company primary color

---

### Phase 4: Accountant Dashboard (Day 4)

#### Step 4.1: Create Accountant Dashboard Page
- [ ] Create `src/features/collectfast/accountant-dashboard/index.tsx`
- [ ] Design aggregate metrics cards
- [ ] Create company cards grid
- [ ] Add click-to-switch functionality

#### Step 4.2: Add Aggregate Data
- [ ] Calculate totals across all companies
- [ ] Create company summary data
- [ ] Add last activity timestamps
- [ ] Style with company colors

#### Step 4.3: Add Route
- [ ] Add route `/app/accountant` or `/app/accountant-dashboard`
- [ ] Add to sidebar navigation (conditional on role)
- [ ] Add navigation from company switcher

---

### Phase 5: Visual Differentiation (Day 5)

#### Step 5.1: Company Color System
- [ ] Apply primary color to:
  - Company switcher
  - Company badge
  - Active states
  - Accent elements
- [ ] Use CSS variables or inline styles

#### Step 5.2: Company Logos
- [ ] Create or use placeholder logos for each company
- [ ] Store in `public/images/companies/`
- [ ] Use in company switcher and badges

#### Step 5.3: Role Indicators
- [ ] Add "Founder" badge in sidebar
- [ ] Add "Accountant" badge in sidebar
- [ ] Show different UI based on role
- [ ] Conditional navigation items

---

### Phase 6: Update All Pages (Day 6)

#### Step 6.1: Dashboard Updates
- [ ] Filter metrics by current company
- [ ] Update tables to show company-specific data
- [ ] Add company context indicator

#### Step 6.2: Customers Page Updates
- [ ] Filter customers by company
- [ ] Update search to work with company context
- [ ] Show company badge in header

#### Step 6.3: Invoices Page Updates
- [ ] Filter invoices by company
- [ ] Update all filters to respect company context
- [ ] Show company-specific totals

#### Step 6.4: Communication Page Updates
- [ ] Filter communications by company
- [ ] Update customer list to show company customers only
- [ ] Update related invoices to be company-specific

#### Step 6.5: Aging Report Updates
- [ ] Filter aging data by company
- [ ] Update summary cards per company
- [ ] Show company-specific totals

#### Step 6.6: Settings Page Updates
- [ ] Show company-specific settings
- [ ] Add company information section
- [ ] Show ERP provider for current company

---

### Phase 7: Polish & Demo Prep (Day 7)

#### Step 7.1: Data Quality
- [ ] Ensure all sample data is realistic
- [ ] Add variety in amounts, dates, statuses
- [ ] Make sure numbers add up correctly
- [ ] Add some "interesting" scenarios (high overdue, etc.)

#### Step 7.2: User Experience
- [ ] Smooth company switching (no flicker)
- [ ] Loading states (if needed)
- [ ] Clear visual feedback on switch
- [ ] Persist selection across page refreshes

#### Step 7.3: Demo Flow
- [ ] Create demo script/checklist
- [ ] Test all click-through paths
- [ ] Ensure accountant can see all companies
- [ ] Ensure founder sees only their company
- [ ] Test company switching from various pages

---

## 📁 File Structure

```
src/
├── context/
│   └── company-context.tsx          # NEW - Company state management
├── components/
│   ├── company-switcher.tsx        # NEW - Company dropdown
│   ├── company-badge.tsx           # NEW - Company indicator
│   └── layout/
│       └── app-sidebar.tsx         # MODIFY - Add switcher
├── features/
│   └── collectfast/
│       ├── accountant-dashboard/   # NEW - Accountant view
│       │   └── index.tsx
│       ├── dashboard/
│       │   └── index.tsx           # MODIFY - Use company context
│       ├── customers/
│       │   └── index.tsx           # MODIFY - Filter by company
│       ├── invoices/
│       │   └── index.tsx           # MODIFY - Filter by company
│       ├── communication/
│       │   └── index.tsx           # MODIFY - Filter by company
│       └── aging-report/
│           └── index.tsx           # MODIFY - Filter by company
└── data/
    └── mock/                        # NEW - All sample data
        ├── companies.ts
        ├── users.ts
        ├── data-service.ts
        └── company-data/
            ├── techstart/
            ├── greenleaf/
            └── metro-retail/
```

---

## 🎨 UI/UX Design Decisions

### Company Switcher Placement
- **Location**: Sidebar header (below logo)
- **Style**: Button with company name + logo
- **Behavior**: Opens popover with searchable list
- **Visual**: Shows current company with checkmark

### Company Badge
- **Location**: Page headers (optional, can be subtle)
- **Style**: Small badge with logo + name
- **Color**: Uses company primary color
- **Purpose**: Always show which company context you're in

### Role Indicators
- **Founder**: Shows "👤 Owner View" badge in sidebar
- **Accountant**: Shows "👔 Accountant View" badge in sidebar
- **Navigation**: Accountant sees "Accountant Dashboard" menu item

### Visual Differentiation
- **Colors**: Each company has unique primary color
- **Logos**: Each company has unique logo/avatar
- **Borders**: Subtle color accents on cards/components
- **Not Overwhelming**: Keep it subtle, professional

---

## 📝 Sample Data Requirements

### Companies Data
```typescript
{
  id: string
  company_name: string
  company_logo: string
  primary_color: string
  secondary_color: string
  erp_provider: 'quickbooks' | 'xero' | 'freshbooks'
  industry: string
  company_size: string
}
```

### Per-Company Data Requirements

**Customers:**
- 8-25 customers per company
- Realistic names, emails, phone numbers
- Varied outstanding amounts
- Different statuses (active, inactive)

**Invoices:**
- 20-80 invoices per company
- Mix of statuses (paid, overdue, due soon)
- Realistic amounts ($100 - $50,000)
- Various dates (some old, some recent)

**Communications:**
- 50-200 communications per company
- Mix of types (email, reminder, call)
- Related to specific invoices
- Various statuses

**Aging Report:**
- Realistic distribution across buckets
- Some companies with high overdue
- Some companies with good payment history
- Totals that match invoice data

---

## 🔧 Technical Implementation Details

### Company Context Hook

```typescript
// Usage in components
const { 
  currentCompany, 
  companies, 
  switchCompany,
  isAccountant 
} = useCompany()

// Get data for current company
const customers = useMemo(() => 
  getCustomersByCompany(currentCompany.id),
  [currentCompany.id]
)
```

### Data Service Pattern

```typescript
// src/data/mock/data-service.ts
export function getCustomersByCompany(companyId: string): Customer[] {
  const companyData = companyDataMap[companyId]
  return companyData?.customers || []
}

export function getInvoicesByCompany(companyId: string): Invoice[] {
  const companyData = companyDataMap[companyId]
  return companyData?.invoices || []
}
```

### LocalStorage Persistence

```typescript
// Save current company
localStorage.setItem('currentCompanyId', companyId)

// Load on mount
const savedCompanyId = localStorage.getItem('currentCompanyId')
```

---

## ✅ Success Criteria

### Functional Requirements
- [ ] User can switch between companies seamlessly
- [ ] All data updates when company changes
- [ ] Accountant can see all companies
- [ ] Founder sees only their company
- [ ] Company context persists across page refreshes
- [ ] Visual differentiation is clear but not overwhelming

### Demo Requirements
- [ ] Can click through entire flow without errors
- [ ] Sample data looks realistic
- [ ] Numbers add up correctly
- [ ] All pages work with company context
- [ ] Company switching is smooth (< 100ms)

### UI/UX Requirements
- [ ] Company switcher is intuitive
- [ ] Current company is always clear
- [ ] Role is clearly indicated
- [ ] Colors/logos differentiate companies
- [ ] No broken states or missing data

---

## 🚀 Quick Start Implementation Order

1. **Day 1**: Create all sample data files and structure
2. **Day 2**: Build company context provider and integrate
3. **Day 3**: Build company switcher component
4. **Day 4**: Create accountant dashboard
5. **Day 5**: Apply visual differentiation
6. **Day 6**: Update all existing pages to use company context
7. **Day 7**: Polish, test, and prepare demo

---

## 📋 Demo Script

### Scenario 1: Founder View (TechStart Inc.)
1. Load app → See TechStart Inc. as current company
2. View Dashboard → See TechStart metrics
3. View Customers → See TechStart customers only
4. View Invoices → See TechStart invoices only
5. Switch company → Should not be able to (founder only sees their company)

### Scenario 2: Accountant View (Emma Wilson)
1. Load app → See accountant dashboard
2. View aggregate metrics → See totals across all companies
3. Click TechStart card → Switch to TechStart context
4. View Dashboard → See TechStart-specific data
5. Switch to GreenLeaf → See GreenLeaf-specific data
6. Switch to Metro Retail → See Metro Retail-specific data
7. Return to Accountant Dashboard → See updated aggregate view

### Scenario 3: Company Switching
1. From any page, open company switcher
2. See list of accessible companies
3. Select different company
4. Page updates with new company's data
5. Navigate to different pages → Data remains filtered to current company

---

## 🎯 Key Principles

1. **No Real Authentication**: Everything is mock data and UI state
2. **Realistic Sample Data**: Make it feel like a real product
3. **Smooth Interactions**: Company switching should be instant
4. **Clear Visual Cues**: Always know which company you're viewing
5. **Demo-Ready**: Everything should work for clicking through
6. **Maintainable**: Clean code structure for future real implementation

---

## 📝 Notes

- This is a **prototype** - focus on visual demonstration
- No backend API calls needed
- All data is client-side
- localStorage for persistence is optional (can use in-memory state)
- Focus on making it **clickable and demo-able**
- Keep code clean for future real implementation

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation  
**Estimated Time**: 7 days

