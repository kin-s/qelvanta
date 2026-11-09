import type { PurchaseOrder, Supplier } from "@/types/suppliers";

export const SUPPLIER_COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "Japan",
  "China",
  "South Korea",
  "India",
  "Kenya",
] as const;

export const PAYMENT_TERMS = [
  "COD",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Prepaid",
] as const;

export const SEED_SUPPLIERS: Supplier[] = [
  {
    id: "sup_001",
    name: "Acme Wholesale",
    contactName: "Sarah Johnson",
    email: "orders@acmewholesale.example",
    phone: "+1 555 1001",
    address: "2200 Industrial Pkwy",
    country: "United States",
    city: "Newark",
    taxId: "US-TAX-ACME-001",
    paymentTerms: "Net 30",
    status: "active",
    notes: "Primary supplier for Logi + Anker accessories. Reliable lead times.",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-10-20T00:00:00Z",
  },
  {
    id: "sup_002",
    name: "Global Tech Supply",
    contactName: "Kenji Nakamura",
    email: "sales@globaltech.example",
    phone: "+81 3 1234 5678",
    address: "1-2-3 Shibuya",
    country: "Japan",
    city: "Tokyo",
    taxId: "JP-TAX-GT-002",
    paymentTerms: "Net 45",
    status: "active",
    notes: "Sony + Samsung distributor. Longer lead times but best prices.",
    createdAt: "2026-02-05T00:00:00Z",
    updatedAt: "2026-10-15T00:00:00Z",
  },
  {
    id: "sup_003",
    name: "Nordic Furniture Co.",
    contactName: "Erik Lund",
    email: "wholesale@nordicfurn.example",
    phone: "+46 8 987 654",
    address: "Sveavägen 45",
    country: "United Kingdom",
    city: "London",
    taxId: "UK-TAX-NFC-003",
    paymentTerms: "Net 30",
    status: "active",
    notes: "Ergonomic chairs and standing desks. Minimum order 5 units.",
    createdAt: "2026-03-15T00:00:00Z",
    updatedAt: "2026-09-28T00:00:00Z",
  },
  {
    id: "sup_004",
    name: "Kitchen World",
    contactName: "Maria Costa",
    email: "orders@kitchenworld.example",
    phone: "+1 555 2002",
    address: "890 Commerce Dr",
    country: "United States",
    city: "Atlanta",
    taxId: "US-TAX-KW-004",
    paymentTerms: "COD",
    status: "active",
    notes: "",
    createdAt: "2026-04-20T00:00:00Z",
    updatedAt: "2026-10-10T00:00:00Z",
  },
  {
    id: "sup_005",
    name: "Apparel Direct",
    contactName: "Tom Wilson",
    email: "trade@appareldirect.example",
    phone: "+1 555 3003",
    address: "150 Fashion Ave",
    country: "United States",
    city: "Los Angeles",
    taxId: "US-TAX-AD-005",
    paymentTerms: "Net 15",
    status: "active",
    notes: "Clothing and footwear. Returns accepted within 14 days.",
    createdAt: "2026-05-08T00:00:00Z",
    updatedAt: "2026-10-05T00:00:00Z",
  },
  {
    id: "sup_006",
    name: "Paper Plus Co.",
    contactName: "",
    email: "info@paperplus.example",
    phone: "+44 20 7000 1000",
    address: "",
    country: "United Kingdom",
    city: "Manchester",
    taxId: "",
    paymentTerms: "Net 30",
    status: "inactive",
    notes: "Dormant since June. Considering alternate stationery supplier.",
    createdAt: "2026-02-12T00:00:00Z",
    updatedAt: "2026-06-20T00:00:00Z",
  },
];

const TAX_RATE = 0.1;

function buildPO(
  id: string,
  supplierId: string,
  supplierName: string,
  createdAt: string,
  expectedDelivery: string,
  status: PurchaseOrder["status"],
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    receivedQty: number;
    unitCost: number;
  }>,
  notes: string,
  receivedAt?: string
): PurchaseOrder {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
  return {
    id,
    supplierId,
    supplierName,
    createdAt,
    expectedDelivery,
    status,
    items: items.map((i) => ({
      ...i,
      lineTotal: Math.round(i.quantity * i.unitCost * 100) / 100,
    })),
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount,
    total: Math.round((subtotal + taxAmount) * 100) / 100,
    notes,
    createdBy: "Demo User",
    receivedAt,
  };
}

export const SEED_PURCHASE_ORDERS: PurchaseOrder[] = [
  buildPO(
    "PO-2026-1101",
    "sup_001",
    "Acme Wholesale",
    "2026-10-20T10:00:00Z",
    "2026-10-28T00:00:00Z",
    "received",
    [
      { productId: "prod_001", productName: "Wireless keyboard", sku: "WK-100", quantity: 50, receivedQty: 50, unitCost: 22 },
    ],
    "Restock keyboards for Q4.",
    "2026-10-28T10:30:00Z"
  ),
  buildPO(
    "PO-2026-1105",
    "sup_001",
    "Acme Wholesale",
    "2026-10-25T14:00:00Z",
    "2026-11-02T00:00:00Z",
    "received",
    [
      { productId: "prod_004", productName: "Mechanical mouse", sku: "MM-150", quantity: 20, receivedQty: 20, unitCost: 18 },
    ],
    "",
    "2026-11-02T16:30:00Z"
  ),
  buildPO(
    "PO-2026-1108",
    "sup_002",
    "Global Tech Supply",
    "2026-10-30T09:15:00Z",
    "2026-11-12T00:00:00Z",
    "ordered",
    [
      { productId: "prod_024", productName: "Smart watch", sku: "SW-600", quantity: 10, receivedQty: 6, unitCost: 240 },
      { productId: "prod_025", productName: "Tablet 10in", sku: "TB-770", quantity: 8, receivedQty: 0, unitCost: 280 },
    ],
    "Tablet line item added after original quote."
  ),
  buildPO(
    "PO-2026-1112",
    "sup_001",
    "Acme Wholesale",
    "2026-11-01T11:30:00Z",
    "2026-11-08T00:00:00Z",
    "received",
    [
      { productId: "prod_010", productName: "Wireless charger", sku: "WC-110", quantity: 15, receivedQty: 15, unitCost: 15 },
    ],
    "",
    "2026-11-05T15:45:00Z"
  ),
  buildPO(
    "PO-2026-1115",
    "sup_003",
    "Nordic Furniture Co.",
    "2026-11-04T16:00:00Z",
    "2026-11-18T00:00:00Z",
    "approved",
    [
      { productId: "prod_012", productName: "Ergonomic chair", sku: "CH-900", quantity: 5, receivedQty: 0, unitCost: 320 },
      { productId: "prod_013", productName: "Standing desk", sku: "SD-950", quantity: 3, receivedQty: 0, unitCost: 450 },
    ],
    "For the new office fit-out."
  ),
  buildPO(
    "PO-2026-1116",
    "sup_005",
    "Apparel Direct",
    "2026-11-05T09:45:00Z",
    "2026-11-10T00:00:00Z",
    "pending_approval",
    [
      { productId: "prod_020", productName: "Cotton t-shirt (M)", sku: "TS-M01", quantity: 100, receivedQty: 0, unitCost: 8 },
      { productId: "prod_021", productName: "Denim jeans (32)", sku: "DJ-32", quantity: 30, receivedQty: 0, unitCost: 32 },
      { productId: "prod_022", productName: "Running shoes (42)", sku: "RS-42", quantity: 20, receivedQty: 0, unitCost: 55 },
    ],
    "Weekly apparel restock. Urgent."
  ),
  buildPO(
    "PO-2026-1117",
    "sup_004",
    "Kitchen World",
    "2026-11-06T08:00:00Z",
    "2026-11-20T00:00:00Z",
    "draft",
    [
      { productId: "prod_017", productName: "Blender 1200W", sku: "BL-300", quantity: 6, receivedQty: 0, unitCost: 68 },
    ],
    "Hold for budget confirmation."
  ),
];