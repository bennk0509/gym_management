


export type SessionStatus = "new" | "done" | "cancel"
export type SessionType = "gym" | "therapy"

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "pending";
export type PaymentType = "session" | "package" | "membership";

export type Session = {
  id: string;
  title: string;
  customer: string;
  employee: string;
  date: string;
  time: string;
  status: SessionStatus;
  type: SessionType;
  start: Date;
  end: Date;
  serviceId: string; // link to Service
  totalPrice: number;
  tip?: number;
  tax?: number;
  paymentStatus?: PaymentStatus;
  paymentId?: string; // link to Payments table
  paymentType?: PaymentType;
};

export type Service = {
  id: string
  name: string
  description: string
  durationMinutes: number
  price: number
  type: "gym" | "therapy"
}

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "therapist" | "trainer" | "masseuse" | "admin";
  specialization: string;
  hireDate: string; // YYYY-MM-DD
  status: "active" | "inactive";
  salary: number; // fixed monthly salary
};

export type Payment = {
  id: string;
  relatedId: string; // session/package/membership ID
  paymentType: PaymentType;
  amount: number;
  tax?: number;
  tip?: number;
  dateReceived: string;
  method: "cash" | "credit" | "debit" | "transfer";
  status: PaymentStatus;
  notes?: string;
};

// ----------------- REFUND -----------------
export type Refund = {
  id: string;
  paymentId: string;
  sessionId?: string;
  amount: number;
  reason:
    | "cancelled"
    | "no-show"
    | "unsatisfied"
    | "package-expiry"
    | "system-error";
  date: string;
  handledBy: string; // admin ID
  notes?: string;
};

// ----------------- PAYROLL -----------------
export type Payroll = {
  id: string;
  employeeId: string;
  period: string; // YYYY-MM (e.g., "2025-10")
  baseSalary: number;
  bonuses?: number;
  deductions?: number;
  netSalary: number; // base + bonus - deductions
  status: "pending" | "paid";
  paidDate?: string;
};

// ----------------- OPERATIONAL COST -----------------
export type OperationalCost = {
  id: string;
  category:
    | "rent"
    | "utilities"
    | "equipment"
    | "marketing"
    | "maintenance"
    | "insurance"
    | "supplies";
  amount: number;
  period: string; // YYYY-MM
  notes?: string;
};

// ----------------- PROMOTIONAL DISCOUNT -----------------
export type PromotionalDiscount = {
  id: string;
  sessionId: string;
  discountType: "percentage" | "flat" | "free";
  discountValue: number;
  reason: string;
  appliedBy: string; // admin ID
};

// ----------------- REVENUE RECOGNITION -----------------
export type RevenueRecognition = {
  id: string;
  sourceType: "session" | "package" | "membership";
  sourceId: string;
  recognizedAmount: number;
  recognitionDate: string;
  notes?: string;
};

export type Expense = {
  id: string
  sourceType: "payroll" | "operational"
  sourceId: string
  amount: number
  date: string
  category?: string
  notes?: string
}

export interface DashboardHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface CustomerSearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onToggleFilters: () => void;
  onRefresh: () => void;
  showFilters: boolean;
}
export interface FiltersPanelProps {
  status: "active" | "inactive" | "all";
  joinStart: string;
  joinEnd: string;
  minSpend: number;
  onStatusChange: (v: "active" | "inactive" | "all") => void;
  onJoinStartChange: (v: string) => void;
  onJoinEndChange: (v: string) => void;
  onMinSpendChange: (v: number) => void;
}
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  sortField?: string | null
  sortOrder?: "asc" | "desc"
  onSort?: (field: string) => void
  onRowClick?: (row: T) => void
  emptyMessage?: string
  maxHeight?: string
  loading: boolean,
}
export type Customer = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string        // YYYY-MM-DD
  membershipType: "basic" | "premium" | "vip"
  joinDate: string           // YYYY-MM-DD
  status: "active" | "inactive"
  notes?: string             // special requests, medical conditions
}


export const mockServices: Service[] = [
  {
    id: "1",
    name: "Morning Yoga",
    description: "Start your day with guided yoga and breathing exercises.",
    durationMinutes: 60,
    price: 40,
    type: "gym",
  },
  {
    id: "2",
    name: "Therapy Session",
    description: "One-on-one therapy session with certified therapist.",
    durationMinutes: 60,
    price: 70,
    type: "therapy",
  },
  {
    id: "3",
    name: "Personal Training",
    description: "Strength and conditioning session with personal trainer.",
    durationMinutes: 90,
    price: 60,
    type: "gym",
  },
  {
    id: "4",
    name: "Pilates",
    description: "Improve flexibility, posture, and balance through pilates.",
    durationMinutes: 60,
    price: 45,
    type: "gym",
  },
  {
    id: "5",
    name: "Rehab Therapy",
    description: "Customized rehabilitation therapy for injuries or recovery.",
    durationMinutes: 60,
    price: 80,
    type: "therapy",
  },
  {
    id: "6",
    name: "Strength Training",
    description: "Progressive strength-building program with trainer.",
    durationMinutes: 75,
    price: 55,
    type: "gym",
  },
  {
    id: "7",
    name: "Mindfulness Coaching",
    description: "Guided meditation and stress-relief exercises.",
    durationMinutes: 45,
    price: 35,
    type: "therapy",
  },
  {
    id: "8",
    name: "Boxing Class",
    description: "High-energy boxing training for fitness and technique.",
    durationMinutes: 60,
    price: 50,
    type: "gym",
  },
  {
    id: "9",
    name: "Massage Therapy",
    description: "Full-body massage for relaxation and recovery.",
    durationMinutes: 90,
    price: 90,
    type: "therapy",
  },
  {
    id: "10",
    name: "Group Fitness Bootcamp",
    description: "Intense group workout to push your limits.",
    durationMinutes: 60,
    price: 30,
    type: "gym",
  },
]

export const mockEmployees: Employee[] = [
  {
    id: "e1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@gym.com",
    phone: "555-1001",
    role: "trainer",
    specialization: "Strength Training",
    hireDate: "2022-05-10",
    status: "active",
    salary: 30,
  },
  {
    id: "e2",
    firstName: "Emma",
    lastName: "Brown",
    email: "emma.brown@gym.com",
    phone: "555-1002",
    role: "therapist",
    specialization: "Rehab Therapy",
    hireDate: "2021-11-20",
    status: "active",
    salary: 5000
  },
  {
    id: "e3",
    firstName: "Sophia",
    lastName: "Wilson",
    email: "sophia.wilson@gym.com",
    phone: "555-1003",
    role: "masseuse",
    specialization: "Massage Therapy",
    hireDate: "2023-02-14",
    status: "active",
    salary: 322
  },
  {
    id: "e4",
    firstName: "Sophkia",
    lastName: "Wilson",
    email: "sophia.wilson@gym.com",
    phone: "555-1003",
    role: "masseuse",
    specialization: "Massage Therapy",
    hireDate: "2023-02-14",
    status: "active",
    salary: 556
  }
]



// Utility to get random item
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// Utility to get random date
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split("T")[0]
}

const firstNames = ["Alice", "Bob", "Emma", "John", "Sophia", "Liam", "Olivia", "Noah", "Mia", "Ethan", "Ava", "James", "Isabella", "Lucas", "Charlotte"]
const lastNames = ["Johnson", "Smith", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris"]
const notesSamples = [
  "Prefers female therapist, allergy to lavender oil",
  "Focus on lower back pain therapy",
  "Enjoys yoga and mindfulness sessions",
  "Request for deep tissue massage",
  "Sensitive skin, avoid strong oils",
  "Morning sessions preferred",
  "Requires wheelchair access",
  "Prefers same-day scheduling when possible"
]
const membershipTypes: Customer["membershipType"][] = ["basic", "premium", "vip"]
const statuses: Customer["status"][] = ["active", "inactive"]

export function generateMockCustomers(count = 500): Customer[] {
  const customers: Customer[] = []
  const usedEmails = new Set<string>()
  const usedPhones = new Set<string>()

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames)
    const lastName = randomItem(lastNames)
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`
    let phone = `555-${2000 + i}`

    // Prevent duplicates (simple)
    while (usedEmails.has(email)) email = `${firstName}.${lastName}${Math.floor(Math.random() * 10000)}@example.com`
    while (usedPhones.has(phone)) phone = `555-${2000 + Math.floor(Math.random() * 8000)}`
    usedEmails.add(email)
    usedPhones.add(phone)

    const customer: Customer = {
      id: `c${i + 1}`,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: randomDate(new Date(1955, 0, 1), new Date(2005, 11, 31)),
      membershipType: randomItem(membershipTypes),
      joinDate: randomDate(new Date(2018, 0, 1), new Date(2025, 0, 1)),
      status: Math.random() > 0.15 ? "active" : "inactive",
      notes: Math.random() > 0.3 ? randomItem(notesSamples) : undefined,
    }

    customers.push(customer)
  }

  return customers
}

// Example usage:
export const mockCustomers = generateMockCustomers(500)


export const generateMockSessions = (count: number): Session[] => {
  const statuses: SessionStatus[] = ["new", "done", "cancel"]

  const sessions: Session[] = []

  for (let i = 0; i < count; i++) {
    const customer = mockCustomers[i % mockCustomers.length]
    const employee = mockEmployees[(i * 3) % mockEmployees.length]
    const status = statuses[i % statuses.length]

    // Pick a random service
    const service = mockServices[Math.floor(Math.random() * mockServices.length)]

    // Random date/time in Oct–Dec 2025
    const dayOffset = Math.floor(Math.random() * 90)
    const startHour = 8 + Math.floor(Math.random() * 10)
    const start = new Date(2025, 9, 1, startHour, 0) // Oct 1 base
    start.setDate(start.getDate() + dayOffset)
    const end = new Date(start.getTime() + service.durationMinutes * 60000)

    const date = start.toISOString().split("T")[0]
    const time = `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")} - ${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`

    sessions.push({
      id: (i + 1).toString(),
      title: service.name,
      customer: `${customer.firstName} ${customer.lastName}`,
      employee: `${employee.firstName} ${employee.lastName}`,
      date,
      time,
      status,
      type: service.type,
      start,
      end,
      serviceId: service.id,
      totalPrice: service.price
    })
  }

  return sessions
}

// Export a ready-to-use dataset
export const mockSessions: Session[] = generateMockSessions(500)


export const mockPayments: Payment[] = mockSessions
  .filter((s) => s.status === "done")
  .slice(0, 250) // only part of sessions are paid
  .map((s, i) => ({
    id: `p${i + 1}`,
    relatedId: s.id,
    paymentType: s.type === "gym" ? "package" : "session",
    amount: s.totalPrice,
    tax: Math.round(s.totalPrice * 0.13 * 100) / 100,
    tip: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
    dateReceived: s.date,
    method: Math.random() > 0.6 ? "credit" : "cash",
    status: "paid",
    notes:
      Math.random() > 0.9
        ? "Paid at front desk"
        : Math.random() > 0.9
        ? "Online payment"
        : undefined,
}));

export const mockPayrolls: Payroll[] = mockEmployees.map((emp, i) => {
  const base = emp.salary;
  const bonus = emp.role === "trainer" ? 150 : emp.role === "admin" ? 300 : 100;
  const deductions = Math.random() > 0.8 ? 50 : 0;
  return {
    id: `payroll-${i + 1}`,
    employeeId: emp.id,
    period: "2025-10",
    baseSalary: base,
    bonuses: bonus,
    deductions,
    netSalary: base + bonus - deductions,
    status: "paid",
    paidDate: "2025-10-30",
  };
});

// =====================================
// 🏢 MOCK OPERATIONAL COSTS
// =====================================

export const mockOperationalCosts: OperationalCost[] = [
  {
    id: "oc1",
    category: "rent",
    amount: 3200,
    period: "2025-10",
    notes: "Main facility lease payment",
  },
  {
    id: "oc2",
    category: "utilities",
    amount: 850,
    period: "2025-10",
    notes: "Electricity, water, and internet bills",
  },
  {
    id: "oc3",
    category: "equipment",
    amount: 1100,
    period: "2025-10",
    notes: "New dumbbells and yoga mats",
  },
  {
    id: "oc4",
    category: "marketing",
    amount: 500,
    period: "2025-10",
    notes: "Instagram & flyer ads for new memberships",
  },
  {
    id: "oc5",
    category: "maintenance",
    amount: 350,
    period: "2025-10",
    notes: "Therapy room repaint + AC cleaning",
  },
];

// =====================================
// 🎁 MOCK PROMOTIONAL DISCOUNTS
// =====================================

export const mockPromotionalDiscounts: PromotionalDiscount[] = [
  {
    id: "promo1",
    sessionId: mockSessions[10].id,
    discountType: "percentage",
    discountValue: 20,
    reason: "Customer loyalty discount",
    appliedBy: "admin001",
  },
  {
    id: "promo2",
    sessionId: mockSessions[25].id,
    discountType: "flat",
    discountValue: 15,
    reason: "Black Friday Promotion",
    appliedBy: "admin002",
  },
  {
    id: "promo3",
    sessionId: mockSessions[30].id,
    discountType: "free",
    discountValue: 100,
    reason: "Free trial session for new VIP customer",
    appliedBy: "admin001",
  },
];

// =====================================
// 💵 MOCK REVENUE RECOGNITION
// =====================================

export const mockRevenueRecognition: RevenueRecognition[] = mockPayments.map(
  (p, i) => ({
    id: `rev-${i + 1}`,
    sourceType: p.paymentType,
    sourceId: p.relatedId,
    recognizedAmount: p.amount,
    recognitionDate: p.dateReceived,
    notes:
      p.paymentType === "package"
        ? "Recognized per session usage"
        : "Session completed and paid",
  })
);


const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0);
const totalPayroll = mockPayrolls.reduce((sum, pr) => sum + pr.netSalary, 0);
const totalOperationalCost = mockOperationalCosts.reduce(
  (sum, oc) => sum + oc.amount,
  0
);
const totalPromos = mockPromotionalDiscounts.reduce(
  (sum, d) =>
    sum + (d.discountType === "percentage" ? 0 : d.discountValue),
  0
);

export const mockFinancialReports = [
  {
    month: "2025-05",
    totalRevenue: 4800,
    totalRefunds: 150,
    totalPayroll: 5800,
    totalOperationalCost: 1000,
    totalPromotionalDiscounts: 120,
  },
  {
    month: "2025-06",
    totalRevenue: 5100,
    totalRefunds: 200,
    totalPayroll: 6000,
    totalOperationalCost: 950,
    totalPromotionalDiscounts: 180,
  },
  {
    month: "2025-07",
    totalRevenue: 5600,
    totalRefunds: 220,
    totalPayroll: 6100,
    totalOperationalCost: 970,
    totalPromotionalDiscounts: 150,
  },
  {
    month: "2025-08",
    totalRevenue: 5900,
    totalRefunds: 180,
    totalPayroll: 6200,
    totalOperationalCost: 1000,
    totalPromotionalDiscounts: 160,
  },
  {
    month: "2025-09",
    totalRevenue: 6000,
    totalRefunds: 210,
    totalPayroll: 6250,
    totalOperationalCost: 980,
    totalPromotionalDiscounts: 140,
  },
  {
    month: "2025-10",
    totalRevenue: 5500,
    totalRefunds: 200,
    totalPayroll: 6000,
    totalOperationalCost: 1000,
    totalPromotionalDiscounts: 150,
  },
];

export const mockExpenses: Expense[] = [
  ...mockPayrolls.map((p) => ({
    id: p.id,
    sourceType: "payroll" as const,
    sourceId: p.employeeId,
    amount: p.netSalary,
    date: `${p.period}-01`,
    notes: "Employee salary",
  })),
  ...mockOperationalCosts.map((o) => ({
    id: o.id,
    sourceType: "operational" as const,
    sourceId: o.id,
    amount: o.amount,
    category: o.category,
    date: `${o.period}-01`,
    notes: o.notes,
  })),
]