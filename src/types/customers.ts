export type CustomerType = "individual" | "business";

export type CustomerSegment =
  | "new"
  | "regular"
  | "vip"
  | "wholesale"
  | "corporate"
  | "inactive";

export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  city: string;
  address: string;
  type: CustomerType;
  segment: CustomerSegment;
  status: CustomerStatus;
  notes: string;
  creditLimit: number;
  createdAt: string;
  updatedAt: string;
}

export const SEGMENT_LABELS: Record<CustomerSegment, string> = {
  new: "New",
  regular: "Regular",
  vip: "VIP",
  wholesale: "Wholesale",
  corporate: "Corporate",
  inactive: "Inactive",
};

export const SEGMENT_VARIANTS: Record<
  CustomerSegment,
  "success" | "info" | "warning" | "accent" | "muted" | "default"
> = {
  new: "info",
  regular: "success",
  vip: "accent",
  wholesale: "warning",
  corporate: "default",
  inactive: "muted",
};