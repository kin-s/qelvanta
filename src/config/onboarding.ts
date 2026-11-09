export const businessTypes = [
  "Sole proprietorship",
  "Partnership",
  "Limited company",
  "Corporation",
  "Cooperative",
  "Non-profit",
] as const;

export const industries = [
  "Retail",
  "Wholesale",
  "Restaurant",
  "Electronics",
  "Distribution",
  "Service business",
  "Small enterprise",
  "Other",
] as const;

export const countries = [
  { code: "US", name: "United States", currency: "USD", timezone: "America/New_York" },
  { code: "GB", name: "United Kingdom", currency: "GBP", timezone: "Europe/London" },
  { code: "CA", name: "Canada", currency: "CAD", timezone: "America/Toronto" },
  { code: "AU", name: "Australia", currency: "AUD", timezone: "Australia/Sydney" },
  { code: "KE", name: "Kenya", currency: "KES", timezone: "Africa/Nairobi" },
  { code: "NG", name: "Nigeria", currency: "NGN", timezone: "Africa/Lagos" },
  { code: "ZA", name: "South Africa", currency: "ZAR", timezone: "Africa/Johannesburg" },
  { code: "IN", name: "India", currency: "INR", timezone: "Asia/Kolkata" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", timezone: "Asia/Dubai" },
  { code: "DE", name: "Germany", currency: "EUR", timezone: "Europe/Berlin" },
  { code: "FR", name: "France", currency: "EUR", timezone: "Europe/Paris" },
  { code: "JP", name: "Japan", currency: "JPY", timezone: "Asia/Tokyo" },
] as const;

export const currencies = [
  "USD", "EUR", "GBP", "CAD", "AUD", "KES", "NGN", "ZAR", "INR", "AED", "JPY", "CHF",
] as const;

export const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Africa/Lagos",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
] as const;

export const languages = [
  { code: "en", name: "English" },
] as const;

export const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (UK/EU)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)" },
  { value: "DD MMM YYYY", label: "DD MMM YYYY" },
] as const;

export const numberFormats = [
  { value: "1,234.56", label: "1,234.56 (US/UK)" },
  { value: "1.234,56", label: "1.234,56 (EU)" },
  { value: "1 234,56", label: "1 234,56 (FR)" },
] as const;

export const structures = [
  {
    id: "single" as const,
    title: "Single location",
    description: "One shop, one warehouse, or one service location.",
  },
  {
    id: "branches" as const,
    title: "Multiple branches",
    description: "Two or more physical locations with their own staff and stock.",
  },
  {
    id: "warehouse" as const,
    title: "Warehouse-based",
    description: "Central warehouse with distribution to branches or customers.",
  },
] as const;

export const moduleOptions = [
  { id: "inventory", label: "Inventory" },
  { id: "sales", label: "Sales & POS" },
  { id: "finance", label: "Finance" },
  { id: "crm", label: "CRM" },
  { id: "employees", label: "Employees" },
  { id: "invoicing", label: "Invoicing" },
  { id: "purchasing", label: "Purchasing" },
] as const;

export const teamRoles = [
  "Administrator",
  "Manager",
  "Accountant",
  "Inventory manager",
  "Cashier",
  "Salesperson",
  "Viewer",
] as const;

export const stepMeta = [
  { id: "welcome", label: "Welcome" },
  { id: "business", label: "Business details" },
  { id: "regional", label: "Regional preferences" },
  { id: "structure", label: "Business structure" },
  { id: "modules", label: "Initial setup" },
  { id: "team", label: "Invite team" },
  { id: "complete", label: "Complete" },
] as const;