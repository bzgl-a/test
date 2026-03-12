export type UserRoles = 'employee' | 'manager';
export type VacationType = 'vacation' | 'day_off';
export type VacationTypeLabel = 'Отпуск' | 'Отгул';
export type VacationStatus = 'approved' | 'rejected' | 'pending';
export type ToastType = 'success' | 'danger' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface VacationTypeOption {
  value: VacationType;
  label: string;
}

export interface User {
  first_name: string;
  last_name: string;
  role: UserRoles;
  days_left: number;
}

export interface AuthResponse {
  token: string;
}

export interface UserLogin {
  login: string;
  password: string;
}

export interface SidebarItem {
  link: string;
  icon: string;
  label: string;
  hasRights: boolean;
}

export interface AbsenceInfo {
  first_name: string;
  last_name: string;
  type: VacationType;
  start_date: Date;
  end_date: Date;
}

export interface VacationRequestBody {
  start_date: string;
  end_date: string;
  type: VacationType;
  comment: string;
}

export interface EmployeeMonthAbsence {
  first_name: string;
  last_name: string;
  absences: VacationRequestBody[];
}

export interface BaseRequestInfo {
  request_id: number;
  start_date: string;
  end_date: string;
  absence_days_count: number;
  type: VacationType;
  status: VacationStatus;
  comment: string;
}

export interface UserRequestInfo extends BaseRequestInfo {
  first_name?: string;
  last_name?: string;
  rejection_reason: string;
  updated_at: string;
  manager_first_name: string | null;
  manager_last_name: string | null;
}

export interface PendingRequestInfo extends BaseRequestInfo {
  first_name: string;
  last_name: string;
  days_left: number;
}

export interface ArchiveRequestInfo extends BaseRequestInfo {
  first_name: string;
  last_name: string;
  rejection_reason: string;
  updated_at: string;
  manager_first_name: string | null;
  manager_last_name: string | null;
}

export interface EmployeeRequests {
  myRequests: UserRequestInfo[];
  teamRequests: ArchiveRequestInfo[];
}

export interface ManagerRequests {
  pendingRequests: PendingRequestInfo[];
  archiveRequests: ArchiveRequestInfo[];
}
