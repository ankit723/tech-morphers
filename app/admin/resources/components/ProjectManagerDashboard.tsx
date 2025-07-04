"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2,
  FolderOpen,
  UserX,
  Plus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserRole } from '@prisma/client';

type ProjectManager = {
  id: string;
  name: string;
  email: string;
  role: string;
  managedClients: Array<{
    id: string;
    client: {
      id: string;
      fullName: string;
      email: string;
      companyName?: string;
      createdAt: Date;
    };
    assignedAt: Date;
    notes?: string;
  }>;
  managedTeamMembers: Array<{
    id: string;
    teamMember: {
      id: string;
      name: string;
      email: string;
      role: string;
      isActive: boolean;
    };
    assignedAt: Date;
    notes?: string;
  }>;
};

type DashboardData = {
  projectManagers?: ProjectManager[];
  clientAssignments?: any[];
  projects?: any[];
  teamMembers?: any[];
  role: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

interface ProjectManagerDashboardProps {
  users: User[];
  onRefresh: () => void;
}

export function ProjectManagerDashboard({ users, onRefresh }: ProjectManagerDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Team Assignment Dialog States
  const [teamAssignDialogOpen, setTeamAssignDialogOpen] = useState(false);
  const [selectedPmId, setSelectedPmId] = useState<string>('');
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/project-manager/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeamMember = async () => {
    if (!selectedPmId || !selectedTeamMemberId) return;

    setAssignmentLoading(true);
    try {
      const response = await fetch('/api/admin/team-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamMemberId: selectedTeamMemberId,
          projectManagerId: selectedPmId,
          notes: assignmentNotes
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setTeamAssignDialogOpen(false);
        setSelectedPmId('');
        setSelectedTeamMemberId('');
        setAssignmentNotes('');
        await loadDashboard();
        onRefresh();
      } else {
        toast.error(result.error || 'Failed to assign team member');
      }
    } catch (error) {
      console.error('Error assigning team member:', error);
      toast.error('Failed to assign team member');
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleRemoveTeamMember = async (teamMemberId: string) => {
    try {
      const response = await fetch(`/api/admin/team-assignments?teamMemberId=${teamMemberId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        await loadDashboard();
        onRefresh();
      } else {
        toast.error(result.error || 'Failed to remove team member');
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  // Get available team members (not assigned to any PM)
  const availableTeamMembers = users.filter(user => 
    user.role !== UserRole.ADMIN && 
    user.role !== UserRole.PROJECT_MANAGER && 
    user.isActive &&
    !dashboardData?.projectManagers?.some(pm => 
      pm.managedTeamMembers.some(tm => tm.teamMember.id === user.id)
    )
  );

  // Get project managers
  const projectManagers = users.filter(user => 
    user.role === UserRole.PROJECT_MANAGER && user.isActive
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Failed to load dashboard
        </h3>
        <Button onClick={loadDashboard}>Try Again</Button>
      </div>
    );
  }

  // Admin View
  if (dashboardData.role === UserRole.ADMIN) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Project Manager Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage project managers, their clients, and team assignments
            </p>
          </div>
          
          <Dialog open={teamAssignDialogOpen} onOpenChange={setTeamAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Assign Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Team Member to Project Manager</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Project Manager</Label>
                  <Select value={selectedPmId} onValueChange={setSelectedPmId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectManagers.map((pm) => (
                        <SelectItem key={pm.id} value={pm.id}>
                          {pm.name} ({pm.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Team Member</Label>
                  <Select value={selectedTeamMemberId} onValueChange={setSelectedTeamMemberId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Assignment Notes</Label>
                  <Textarea
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    placeholder="Optional notes about this assignment..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setTeamAssignDialogOpen(false)}
                    disabled={assignmentLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAssignTeamMember}
                    disabled={!selectedPmId || !selectedTeamMemberId || assignmentLoading}
                  >
                    {assignmentLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Assign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Project Managers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.projectManagers?.map((pm, index) => (
            <motion.div
              key={pm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {pm.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{pm.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{pm.email}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Assigned Clients */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Assigned Clients ({pm.managedClients.length})
                      </h5>
                    </div>
                    {pm.managedClients.length > 0 ? (
                      <div className="space-y-2">
                        {pm.managedClients.slice(0, 3).map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {assignment.client.fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {assignment.client.companyName || assignment.client.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {pm.managedClients.length > 3 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            +{pm.managedClients.length - 3} more clients
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No clients assigned</p>
                    )}
                  </div>

                  {/* Assigned Team Members */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        Team Members ({pm.managedTeamMembers.length})
                      </h5>
                    </div>
                    {pm.managedTeamMembers.length > 0 ? (
                      <div className="space-y-2">
                        {pm.managedTeamMembers.map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {assignment.teamMember.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {assignment.teamMember.role}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTeamMember(assignment.teamMember.id)}
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No team members assigned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {dashboardData.projectManagers?.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Project Managers
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create project manager users to manage clients and teams.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Project Manager View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Dashboard
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your assigned clients, projects, and team members
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>My Clients ({dashboardData.clientAssignments?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.clientAssignments && dashboardData.clientAssignments.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.clientAssignments.map((assignment: any, index: number) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {assignment.client.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {assignment.client.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {assignment.client.companyName || assignment.client.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {assignment.client.estimators?.length || 0} projects
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No clients assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span>My Team ({dashboardData.teamMembers?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.teamMembers && dashboardData.teamMembers.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.teamMembers.map((member: any, index: number) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      Active
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No team members assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      {dashboardData.projects && dashboardData.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-purple-600" />
              <span>Recent Projects ({dashboardData.projects.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.projects.slice(0, 5).map((project: any, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {project.projectType || 'Untitled Project'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {project.client?.fullName || project.fullName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {project.projectStatus?.replace('_', ' ') || 'Unknown'}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 