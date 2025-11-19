export type CustomerStatus = "active" | "inactive";
export interface Customer {
  id? : string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  joinDate?: string;
  membershipType?: string;
  status: CustomerStatus;
  totalSpent?: number;
  notes?: string;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  avgSpending: number;
}
export type PackageStatus = "ACTIVE" | "USED" | "EXPRIRED" | 'CANCELLED';
export interface Packages {
  id?: string;
  name: string;
  type: SessionType;
  totalSessions: number;
  remaining?: number;
  price: number;
  status: PackageStatus;

  trainerId?: string | null;
  notes?: string;

  startDate: string; // ISO date string
  endDate?: string; // ISO date string | null
  customerId: string;
}
export interface CustomerPagination {
  total: number;
  totalPages: number;
  page: number;
}

export interface CustomerListResponse {
  data: Customer[];
  pagination: CustomerPagination;
}

export interface CustomerDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  joinDate?: string;
  membershipType?: string;
  status: string;
  stats: {
    totalSessions: number;
    completedSessions: number;
    totalSpent: number;
    lastPayment?: { amount: number; date: string } | null;
  };
  sessionHistory: {
    id: string;
    title: string;
    date: string;
    totalPrice: number;
    type: string;
    status: string;
  }[];
  paymentHistory: {
    id: string;
    amount: number;
    status: string;
    dateReceived: string;
    method: string;
  }[];
  packages: Packages[];
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


export interface Employee{
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
}

export interface CalendarProps {
  date: Date
  events: Session[]
  onEdit?: (s: Session) => void
  onDelete?: (s: Session) => void
}


export type SessionStatus = "new" | "done" | "cancel"
export type SessionType = "gym" | "therapy"

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "pending";
export type PaymentType = "session" | "package" | "membership";

export interface Session {
  id: string
  title: string
  status: SessionStatus
  type: SessionType
  start: string // ISO datetime string
  end: string // ISO datetime string
  totalPrice: number
  tip: number | null
  tax: number | null
  customerId: string
  employeeId: string
  serviceId: string | number
  packageId: string | null
  customer: Customer
  employee: Employee
  service: Service
  payment?: Payment | null
}

export type Service = {
  id: string
  name: string
  description: string
  durationMinutes: number
  price: number
  type: "gym" | "therapy"
}

export interface CalendarProps {
  date: Date
  events: Session[]
  onEdit?: (s: Session) => void
  onDelete?: (s: Session) => void
  onMarkComplete?: (s:Session) => void
}

export interface EmployeeStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  totalRevenue: number;
}
export interface EmployeeSession {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  totalPrice: number;
  customer: {
    firstName: string;
    lastName: string;
  };
}

export interface EmployeePayroll {
  id: string;
  period: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: "paid" | "pending" | "cancelled";
}

export interface EmployeeDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string | null;
  hireDate: string;
  status: "active" | "inactive";
  salary: number;
  stats: EmployeeStats;
  sessionHistory: EmployeeSession[];
  payrollHistory: EmployeePayroll[];
}


export type PaymentFor = "SESSION" | "PACKAGE"

export type PaymentMethod = "cash" | "credit" | "debit" | "transfer"

export interface Payment {
  id: string

  amount: number
  tax: number | null
  tip: number | null

  dateReceived: string  // ISO date string from backend

  method: PaymentMethod
  status: PaymentStatus
  notes?: string | null

  paymentFor: PaymentFor

  // Relations (optional depending on use)
  sessionId?: string | null
  packageId?: string | null

  session?: {
    id: string
    title: string
    start: string
    end: string
  } | null

  package?: {
    id: string
    name: string
    price: number
  } | null

  createdAt: string
  updatedAt: string
}

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
export type CostCategory =
  | "RENT"
  | "UTILITIES"
  | "EQUIPMENT"
  | "MAINTENANCE"
  | "MARKETING"
  | "SALARY"
  | "OTHER"

export interface OperationalCost {
  id: string
  category: CostCategory
  amount: number
  
  periodStart: string   // ISO string (Date)
  periodEnd: string     // ISO string (Date)

  notes?: string | null

  createdAt: string
  updatedAt: string
}


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
export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface TopService {
  id: string;
  name: string;
  type: "gym" | "therapy";
  description: string;
  durationMinutes: number;
  price: number;
  revenue: number;
  percent: number;
}

export interface EmployeePerformance {
  name: string;
  revenue: number;
  sessions: number;
}

export interface ActiveCustomer {
  name: string;
  sessions: number;
  spent: number;
}

export interface UpcomingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  service: string;
  type: "gym" | "therapy";
  customer: string;
  employee: string;
}

export interface DashboardStats {
  todaysRevenue: number;
  todaysSessions: number;
  newCustomersToday: number;
  activeCustomers: number;
}

export interface Dashboard
  extends DashboardStats {
  monthlyRevenue: MonthlyRevenue[];
  topServices: TopService[];
  topEmployees: EmployeePerformance[];
  activeCustomersList: ActiveCustomer[];
  upcomingSessions: UpcomingSession[];
}
