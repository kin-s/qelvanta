import type { Branch, Warehouse } from "@/types/operations";

export const SEED_BRANCHES: Branch[] = [
  {
    id: "br_001", name: "Main HQ", code: "HQ-01", address: "123 Commerce St", city: "New York", country: "United States",
    manager: "Amina Kimani", phone: "+1 555 0100", status: "active", createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "br_002", name: "Store Front", code: "SF-02", address: "45 Retail Ave", city: "New York", country: "United States",
    manager: "Bob Smith", phone: "+1 555 0199", status: "active", createdAt: "2026-02-15T00:00:00Z"
  },
  {
    id: "br_003", name: "Westlands Branch", code: "WL-03", address: "Westlands Square", city: "Nairobi", country: "Kenya",
    manager: "Wanjiku Mwangi", phone: "+254 700 100200", status: "active", createdAt: "2026-05-10T00:00:00Z"
  },
  {
    id: "br_004", name: "London Office", code: "LDN-04", address: "12 King William St", city: "London", country: "United Kingdom",
    manager: "Sara Chen", phone: "+44 20 7946 0100", status: "inactive", createdAt: "2026-06-20T00:00:00Z"
  }
];

export const SEED_WAREHOUSES: Warehouse[] = [
  {
    id: "wh_001", name: "Main Warehouse", code: "WH-MAIN", branchId: "br_001", address: "789 Industrial Pkwy", manager: "Wanjiku Mwangi", capacity: 5000, status: "active", createdAt: "2026-01-05T00:00:00Z"
  },
  {
    id: "wh_002", name: "Store Storage", code: "WH-SF", branchId: "br_002", address: "45 Retail Ave (Rear)", manager: "Bob Smith", capacity: 500, status: "active", createdAt: "2026-02-15T00:00:00Z"
  },
  {
    id: "wh_003", name: "Nairobi Depot", code: "WH-NRB", branchId: "br_003", address: "Mombasa Rd, Industrial Area", manager: "Tunde Adeyemi", capacity: 2000, status: "active", createdAt: "2026-05-15T00:00:00Z"
  },
  {
    id: "wh_004", name: "Overflow Storage", code: "WH-OVF", branchId: "br_001", address: "790 Industrial Pkwy", manager: "Amina Kimani", capacity: 1000, status: "inactive", createdAt: "2026-08-01T00:00:00Z"
  }
];