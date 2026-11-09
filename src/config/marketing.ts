import {
  Package, ShoppingCart, Wallet, Users, UserCog, BarChart3, Sparkles, Zap,
  Store, Warehouse, UtensilsCrossed, Smartphone, Truck, Briefcase, Building2,
} from "lucide-react";

export const marketingNav = [
  { label: "Features", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/help" },
] as const;

export const features = [
  { icon: Package, title: "Inventory", description: "Real-time stock across locations with low-stock alerts, variants, and full movement history." },
  { icon: ShoppingCart, title: "Sales & POS", description: "Fast, keyboard-friendly point of sale with receipts, returns, and multi-payment methods." },
  { icon: Wallet, title: "Finance", description: "Expenses, income, cash flow, receivables and payables — all reconciled to one ledger." },
  { icon: Users, title: "CRM", description: "Customer profiles, purchase history, outstanding balances, and segmentation built in." },
  { icon: UserCog, title: "Employees", description: "Directory, attendance, leave, shifts, and payroll records for multi-location teams." },
  { icon: BarChart3, title: "Analytics", description: "Live dashboards and reports you can filter, print, and export — no spreadsheet gymnastics." },
  { icon: Sparkles, title: "AI Assistant", description: "Ask questions about your own business in plain language and get grounded, sourced answers." },
  { icon: Zap, title: "Automation", description: "Trigger reminders, summaries, and alerts when stock, invoices, or shifts hit thresholds." },
] as const;

export const walkthroughSteps = [
  { title: "Register a product", description: "Add a product with price, SKU, and reorder level. It syncs to all locations instantly." },
  { title: "Record a sale", description: "Scan a barcode, pick a customer, take payment. Inventory updates in real time." },
  { title: "Watch inventory update", description: "Every sale, return, and transfer is logged in an auditable stock movement trail." },
  { title: "Track an expense", description: "Categorize rent, salaries, transport. Attach the receipt. Always in one place." },
  { title: "Review performance", description: "Revenue, profit, cash flow — one dashboard, filtered to any date range you need." },
] as const;

export const industries = [
  { icon: Store, name: "Retail", description: "Shops and boutiques managing stock and daily sales." },
  { icon: Warehouse, name: "Wholesale", description: "Bulk pricing, credit terms, and tiered customers." },
  { icon: UtensilsCrossed, name: "Restaurants", description: "Menu items, table orders, daily takings." },
  { icon: Smartphone, name: "Electronics", description: "Serial-tracked units, warranties, and repairs." },
  { icon: Truck, name: "Distribution", description: "Multi-warehouse stock and purchase orders." },
  { icon: Briefcase, name: "Service businesses", description: "Quotations, invoices, and recurring billing." },
  { icon: Building2, name: "Small enterprises", description: "Everything you need to run lean and grow." },
] as const;

export const plans = [
  {
    id: "free", name: "Free", description: "For getting started",
    monthlyPrice: 0, annualPrice: 0, cta: "Start for free", highlight: false,
    features: ["1 user", "1 location", "Up to 50 products", "Basic inventory & sales", "Community support"],
  },
  {
    id: "starter", name: "Starter", description: "For small teams",
    monthlyPrice: 12, annualPrice: 120, cta: "Choose Starter", highlight: false,
    features: ["3 users", "1 location", "Unlimited products", "Sales & POS", "Basic reports", "Email support"],
  },
  {
    id: "growth", name: "Growth", description: "For growing businesses",
    monthlyPrice: 29, annualPrice: 290, cta: "Choose Growth", highlight: true,
    features: ["10 users", "3 locations", "Everything in Starter", "Purchasing & suppliers", "Advanced reports", "Basic automations", "Priority support"],
  },
  {
    id: "business", name: "Business", description: "For established operations",
    monthlyPrice: 79, annualPrice: 790, cta: "Choose Business", highlight: false,
    features: ["Unlimited users", "Unlimited locations", "Everything in Growth", "AI assistant", "Advanced automations", "Audit log", "Priority support"],
  },
  {
    id: "enterprise", name: "Enterprise", description: "For large organizations",
    monthlyPrice: null, annualPrice: null, cta: "Contact sales", highlight: false,
    features: ["Unlimited everything", "Dedicated infrastructure", "Custom SLAs", "SSO & advanced security", "Dedicated success manager", "Custom integrations"],
  },
] as const;

export const faqs = [
  { q: "What is QELVANTA?", a: "QELVANTA is a business management platform that brings inventory, sales, finance, CRM, people, and reporting into one product. It is designed for small and medium-sized businesses operating internationally." },
  { q: "Who can use it?", a: "Retail, wholesale, restaurants, electronics, distribution, service businesses, and small enterprises — from a single shop to multi-branch operations. Any business that needs to see its operations clearly." },
  { q: "Can I manage multiple branches?", a: "Yes. Growth plan and above include multi-location support with per-branch reporting and consolidated views. Each branch can have its own inventory, team, and reporting." },
  { q: "Can I invite employees?", a: "Yes. Every plan supports inviting team members with role-based access — from cashier to administrator. Granular permissions are available on Business and Enterprise." },
  { q: "Can I manage different currencies?", a: "QELVANTA stores each transaction in its own currency and reports in your organization's base currency. Multi-currency amounts use ISO codes and Intl formatting — no hardcoded symbols." },
  { q: "Does QELVANTA support mobile devices?", a: "The web application is fully responsive on phones and tablets. Native Android and iOS apps are planned for a future release." },
  { q: "Is my business information private?", a: "Your data is isolated to your organization. During the current frontend-development phase, no data leaves your device — everything runs on mock data and localStorage. Real backend security arrives with the backend phase." },
  { q: "Can I cancel my subscription?", a: "Yes, you can cancel at any time. You keep access until the end of your billing period. Billing is handled through our payment provider once live." },
  { q: "Does QELVANTA support multiple businesses?", a: "The Business plan and above allow running multiple businesses (organizations) under one account. You can switch between them from the workspace switcher." },
  { q: "Can I export reports?", a: "Yes. Reports can be printed and exported to CSV. PDF export is coming in a future release." },
] as const;

export const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Solutions", href: "/solutions" },
    { label: "FAQ", href: "/faq" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Help centre", href: "/help" },
  ],
  legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Cookies", href: "/legal/cookies" },
  ],
} as const;