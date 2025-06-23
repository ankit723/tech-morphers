import { UserRole, ProjectStatus, AssignmentPriority, AssignmentStatus } from '@prisma/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectAssignment {
  id: string;
  projectId: string;
  userId: string;
  workDescription: string | null;
  role: string | null;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  hoursEstimated: number | null;
  hoursWorked: number | null;
  progressNotes: string | null;
  lastUpdated: Date;
  assignedBy: string | null;
  assignedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface Project {
  id: string;
  projectType: string | null;
  projectPurpose: string | null;
  projectStatus: ProjectStatus;
  projectCost: number | null;
  currency: string | null;
  budgetRange: string | null;
  deliveryTimeline: string | null;
  customRequests: string | null;
  fullName: string;
  email: string;
  companyName: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignedUserId: string | null;
  clientId: string | null;
  
  // Relations
  client?: {
    id: string;
    fullName: string;
    email: string;
  };
  assignedUser?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  
  // New many-to-many assignments
  projectAssignments?: ProjectAssignment[];
  
  // Calculated fields
  totalPaid?: number;
  totalVerified?: number;
  isFullyPaid?: boolean;
  exceededAmount?: number;
}

export interface KanbanColumn {
  id: ProjectStatus;
  title: string;
  color: string;
  projects: Project[];
}

export interface UserWithStats extends User {
  assignedProjectsCount: number;
  completedProjectsCount: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  password?: string;
}

export interface ProjectFilters {
  assignedUser: string;
  status: string;
  client: string;
  search: string;
}

export interface ResourceStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  completedProjects: number;
  pendingProjects: number;
  unassignedProjects: number;
}

export interface CreateAssignmentData {
  userId: string;
  workDescription?: string;
  role?: string;
  priority?: AssignmentPriority;
  hoursEstimated?: number;
  assignedBy?: string;
}

export interface UpdateAssignmentData {
  workDescription?: string;
  role?: string;
  priority?: AssignmentPriority;
  hoursEstimated?: number;
  hoursWorked?: number;
  progressNotes?: string;
  status?: AssignmentStatus;
} 