export type LocationStatus = "active" | "inactive";

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  manager: string;
  phone: string;
  status: LocationStatus;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  branchId: string;
  address: string;
  manager: string;
  capacity: number; // max units
  status: LocationStatus;
  createdAt: string;
}

export const COUNTRIES = [
  "United States", "United Kingdom", "Kenya", "South Africa", "Nigeria", 
  "India", "United Arab Emirates", "Germany", "France", "Japan"
] as const;