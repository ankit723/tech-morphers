"use client"

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import {
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import { 
  FolderKanban, 
  Search, 
  Calendar,
  DollarSign,
  MoreVertical,
  UserCheck,
  GripVertical,
  Clock,
  Star,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectStatus } from '@prisma/client';
import { Project, User as UserType, KanbanColumn, ProjectFilters } from '../types';
import { ProjectAssignments } from './ProjectAssignments';

interface ProjectKanbanProps {
  projects: Project[];
  users: UserType[];
  onRefresh: () => void;
  loading: boolean;
}

const PROJECT_STATUS_CONFIG = {
  JUST_STARTED: { title: 'Just Started', color: 'bg-gray-100 border-gray-300', textColor: 'text-gray-800' },
  TEN_PERCENT: { title: '10% Complete', color: 'bg-red-100 border-red-300', textColor: 'text-red-800' },
  THIRTY_PERCENT: { title: '30% Complete', color: 'bg-orange-100 border-orange-300', textColor: 'text-orange-800' },
  FIFTY_PERCENT: { title: '50% Complete', color: 'bg-yellow-100 border-yellow-300', textColor: 'text-yellow-800' },
  SEVENTY_PERCENT: { title: '70% Complete', color: 'bg-blue-100 border-blue-300', textColor: 'text-blue-800' },
  ALMOST_COMPLETED: { title: 'Almost Done', color: 'bg-purple-100 border-purple-300', textColor: 'text-purple-800' },
  COMPLETED: { title: 'Completed', color: 'bg-green-100 border-green-300', textColor: 'text-green-800' }
};

// Draggable Project Card Component
function DraggableProjectCard({ project, onShowDetails }: { 
  project: Project; 
  onShowDetails: (project: Project) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: project.id,
    data: {
      type: 'project',
      project,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // Get active assignments
  const activeAssignments = project.projectAssignments?.filter(a => a.status === 'ACTIVE') || [];
  const legacyAssignedUser = project.assignedUser;

  // Show both new assignments and legacy assigned user if they exist
  const allAssignees = [...activeAssignments];
  if (legacyAssignedUser && !activeAssignments.some(a => a.userId === legacyAssignedUser.id)) {
    // Create a temporary assignment-like object for legacy user
    allAssignees.push({
      id: 'legacy',
      userId: legacyAssignedUser.id,
      user: legacyAssignedUser,
      workDescription: null,
      role: null,
      priority: 'MEDIUM' as any,
      status: 'ACTIVE' as any,
      projectId: project.id,
      hoursEstimated: null,
      hoursWorked: null,
      progressNotes: null,
      lastUpdated: new Date(),
      assignedBy: null,
      assignedAt: new Date(),
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH': return <Star className="w-3 h-3 text-orange-500" />;
      case 'URGENT': return <AlertCircle className="w-3 h-3 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                {project.projectType || 'Untitled Project'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {project.client?.fullName || project.fullName}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowDetails(project);
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Project Description */}
            {project.projectPurpose && (
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.projectPurpose}
              </p>
            )}

            {/* Multiple Assignees */}
            <div className="space-y-2">
              {allAssignees.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Team ({allAssignees.length})
                    </span>
                  </div>
                  
                  {/* First 2 assignees shown, rest as "+X more" */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {allAssignees.slice(0, 2).map((assignment) => (
                      <div key={assignment.id} className="flex items-center gap-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {assignment.user.name.charAt(0).toUpperCase()}
                        </div>
                        {assignment.priority && getPriorityIcon(assignment.priority) && (
                          <div className="flex items-center">
                            {getPriorityIcon(assignment.priority)}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {allAssignees.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{allAssignees.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Show work descriptions for active assignments */}
                  {activeAssignments.slice(0, 2).map((assignment) => (
                    assignment.workDescription && (
                      <div key={assignment.id} className="text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded border-l-2 border-blue-300">
                        <span className="font-medium">{assignment.user.name}:</span> {assignment.workDescription}
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowDetails(project);
                  }}
                  className="text-xs w-full"
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  Assign Team
                </Button>
              )}
            </div>

            {/* Project Details */}
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
              {project.projectCost && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {project.currency || 'USD'} {project.projectCost}
                </div>
              )}
            </div>

            {/* Budget Range */}
            {project.budgetRange && (
              <Badge variant="outline" className="text-xs">
                {project.budgetRange}
              </Badge>
            )}

            {/* Time tracking for assignments */}
            {activeAssignments.some(a => a.hoursEstimated || a.hoursWorked) && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {activeAssignments.reduce((sum, a) => sum + (a.hoursWorked || 0), 0)}/
                  {activeAssignments.reduce((sum, a) => sum + (a.hoursEstimated || 0), 0)}h
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({ column, children }: { column: KanbanColumn; children: React.ReactNode }) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80">
      <div className={`rounded-lg border-2 ${column.color} p-4 mb-4 ${isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold ${PROJECT_STATUS_CONFIG[column.id].textColor}`}>
            {column.title}
          </h3>
          <Badge variant="secondary" className={PROJECT_STATUS_CONFIG[column.id].textColor}>
            {column.projects.length}
          </Badge>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div 
            className="bg-current h-1 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage(column.id)}%` }}
          />
        </div>
      </div>

      <div className={`space-y-4 min-h-[200px] p-2 rounded-lg transition-colors ${isOver ? 'bg-blue-50 dark:bg-blue-950' : ''}`}>
        {children}
      </div>
    </div>
  );
}

const getProgressPercentage = (status: ProjectStatus): number => {
  switch (status) {
    case 'JUST_STARTED': return 0;
    case 'TEN_PERCENT': return 10;
    case 'THIRTY_PERCENT': return 30;
    case 'FIFTY_PERCENT': return 50;
    case 'SEVENTY_PERCENT': return 70;
    case 'ALMOST_COMPLETED': return 90;
    case 'COMPLETED': return 100;
    default: return 0;
  }
};

export function ProjectKanban({ projects, users, onRefresh }: ProjectKanbanProps) {
  const [filters, setFilters] = useState<ProjectFilters>({
    assignedUser: 'all',
    status: 'all',
    client: 'all',
    search: ''
  });
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  // Local state for optimistic updates
  const [localProjects, setLocalProjects] = useState<Project[]>(projects);
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());

  // Update local state when props change
  React.useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Optimistic update function
  const updateProjectStatusOptimistically = useCallback((projectId: string, newStatus: ProjectStatus) => {
    setLocalProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, projectStatus: newStatus }
          : project
      )
    );
  }, []);

  // Revert optimistic update if API call fails
  const revertProjectStatus = useCallback((projectId: string, originalStatus: ProjectStatus) => {
    setLocalProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, projectStatus: originalStatus }
          : project
      )
    );
  }, []);

  // Filter projects using local state
  const filteredProjects = localProjects.filter(project => {
    const matchesSearch = project.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.projectType?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.companyName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.email?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesUser = filters.assignedUser === 'all' || 
                       (filters.assignedUser === 'unassigned' && !project.assignedUserId && (!project.projectAssignments || project.projectAssignments.length === 0)) ||
                       project.assignedUserId === filters.assignedUser ||
                       project.projectAssignments?.some(a => a.userId === filters.assignedUser && a.status === 'ACTIVE');
    
    const matchesStatus = filters.status === 'all' || project.projectStatus === filters.status;
    
    const matchesClient = filters.client === 'all' || 
                         project.client?.fullName?.toLowerCase().includes(filters.client.toLowerCase());

    return matchesSearch && matchesUser && matchesStatus && matchesClient;
  });

  // Group projects by status using filtered local state
  const kanbanColumns: KanbanColumn[] = Object.entries(PROJECT_STATUS_CONFIG).map(([status, config]) => ({
    id: status as ProjectStatus,
    title: config.title,
    color: config.color,
    projects: filteredProjects.filter(project => project.projectStatus === status)
  }));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const project = active.data.current?.project;
    if (project) {
      setActiveProject(project);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over) return;

    const draggedProject = active.data.current?.project;
    const newStatus = over.id as ProjectStatus;

    if (draggedProject && draggedProject.projectStatus !== newStatus) {
      const originalStatus = draggedProject.projectStatus;
      const projectId = draggedProject.id;

      // Add to pending updates
      setPendingUpdates(prev => new Set(prev).add(projectId));

      // Optimistic update - update UI immediately
      updateProjectStatusOptimistically(projectId, newStatus);

      try {
        // Make API call in background
        const response = await fetch(`/api/admin/projects/${projectId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        const result = await response.json();

        if (!result.success) {
          // Revert if API call failed
          revertProjectStatus(projectId, originalStatus);
          alert(`Error: ${result.error}`);
        }
        // If successful, the optimistic update was correct, no need to do anything
      } catch (error) {
        // Revert if API call failed
        revertProjectStatus(projectId, originalStatus);
        console.error('Error updating project status:', error);
        alert('Error updating project status. Please try again.');
      } finally {
        // Remove from pending updates
        setPendingUpdates(prev => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
        
        // Refresh data from server to ensure consistency
        onRefresh();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track project progress and manage team assignments • Drag cards to update status
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-2">
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {localProjects.length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Total Projects</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {localProjects.filter(p => p.projectStatus !== 'COMPLETED').length}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">In Progress</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {localProjects.filter(p => p.projectStatus === 'COMPLETED').length}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Completed</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {localProjects.filter(p => !p.assignedUserId && (!p.projectAssignments || p.projectAssignments.length === 0)).length}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">Unassigned</div>
          </div>
        </div>
      </div>

      {/* Pending Updates Indicator */}
      {pendingUpdates.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              Syncing {pendingUpdates.size} project update{pendingUpdates.size > 1 ? 's' : ''} with server...
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects, clients, types..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select 
            value={filters.assignedUser} 
            onValueChange={(value) => setFilters({ ...filters, assignedUser: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.status} 
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(PROJECT_STATUS_CONFIG).map(([status, config]) => (
                <SelectItem key={status} value={status}>
                  {config.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter by client..."
            value={filters.client}
            onChange={(e) => setFilters({ ...filters, client: e.target.value })}
          />
        </div>
      </div>

      {/* Kanban Board with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6">
          {kanbanColumns.map((column) => (
            <DroppableColumn key={column.id} column={column}>
              <AnimatePresence>
                {column.projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={pendingUpdates.has(project.id) ? 'ring-2 ring-blue-300 ring-opacity-50 rounded-lg' : ''}
                  >
                    <DraggableProjectCard 
                      project={project} 
                      onShowDetails={setSelectedProject}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {column.projects.length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                  <FolderKanban className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No projects in this stage</p>
                  <p className="text-xs mt-1">Drag projects here to update status</p>
                </div>
              )}
            </DroppableColumn>
          ))}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeProject ? (
            <div className="rotate-3 shadow-xl">
              <DraggableProjectCard 
                project={activeProject} 
                onShowDetails={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Project Details Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Project Details - {selectedProject.projectType || 'Untitled'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Info */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Project Type
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProject.projectType || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Project Purpose
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProject.projectPurpose || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Budget Range
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProject.budgetRange || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timeline
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProject.deliveryTimeline || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Client Name
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProject.client?.fullName || selectedProject.fullName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProject.client?.email || selectedProject.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedProject.companyName || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </Label>
                    <Badge className={PROJECT_STATUS_CONFIG[selectedProject.projectStatus].textColor}>
                      {PROJECT_STATUS_CONFIG[selectedProject.projectStatus].title}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Custom Requests */}
              {selectedProject.customRequests && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Special Requirements
                  </Label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {selectedProject.customRequests}
                  </p>
                </div>
              )}

              {/* Project Assignments Component */}
              <ProjectAssignments
                projectId={selectedProject.id}
                assignments={selectedProject.projectAssignments || []}
                availableUsers={users}
                onRefresh={onRefresh}
              />

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setSelectedProject(null)}
                  variant="outline"
                  className="ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 