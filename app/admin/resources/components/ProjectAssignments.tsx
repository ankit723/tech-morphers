"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus,
  X,
  Edit3,
  Clock,
  AlertCircle,
  CheckCircle,
  Pause,
  XCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ProjectAssignment, User, CreateAssignmentData, UpdateAssignmentData } from '../types';
import { AssignmentPriority, AssignmentStatus, UserRole } from '@prisma/client';

interface ProjectAssignmentsProps {
  projectId: string;
  assignments: ProjectAssignment[];
  availableUsers: User[];
  onRefresh: () => void;
  currentUser?: User | null;
}

export function ProjectAssignments({ 
  projectId, 
  assignments, 
  availableUsers, 
  onRefresh,
  currentUser
}: ProjectAssignmentsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<ProjectAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newAssignment, setNewAssignment] = useState<CreateAssignmentData>({
    userId: '',
    workDescription: '',
    role: '',
    priority: 'MEDIUM',
    hoursEstimated: undefined
  });

  const [editAssignment, setEditAssignment] = useState<UpdateAssignmentData>({});

  const assignedUserIds = assignments.map(a => a.userId);
  const unassignedUsers = availableUsers.filter(user => 
    !assignedUserIds.includes(user.id) && user.isActive
  );

  // Check if current user can manage assignments (only ADMIN and PROJECT_MANAGER)
  const canManageAssignments = currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROJECT_MANAGER);

  const resetNewAssignment = () => {
    setNewAssignment({
      userId: '',
      workDescription: '',
      role: '',
      priority: 'MEDIUM',
      hoursEstimated: undefined
    });
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.userId) {
      alert('Please select a user');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssignment),
      });

      const result = await response.json();

      if (result.success) {
        setShowAddDialog(false);
        resetNewAssignment();
        onRefresh();
        alert('User assigned successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding assignment:', error);
      alert('Error adding assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAssignment = async () => {
    if (!editingAssignment) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/assignments`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: editingAssignment.userId,
          ...editAssignment
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowEditDialog(false);
        setEditingAssignment(null);
        setEditAssignment({});
        onRefresh();
        alert('Assignment updated successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Error updating assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAssignment = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/assignments?userId=${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        onRefresh();
        alert('User unassigned successfully!');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error removing assignment:', error);
      alert('Error removing assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (assignment: ProjectAssignment) => {
    setEditingAssignment(assignment);
    setEditAssignment({
      workDescription: assignment.workDescription || '',
      role: assignment.role || '',
      priority: assignment.priority,
      hoursEstimated: assignment.hoursEstimated || undefined,
      hoursWorked: assignment.hoursWorked || undefined,
      progressNotes: assignment.progressNotes || '',
      status: assignment.status
    });
    setShowEditDialog(true);
  };

  const getPriorityColor = (priority: AssignmentPriority) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'URGENT': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getStatusIcon = (status: AssignmentStatus) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PAUSED': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getPriorityIcon = (priority: AssignmentPriority) => {
    switch (priority) {
      case 'LOW': return null;
      case 'MEDIUM': return <AlertCircle className="w-3 h-3" />;
      case 'HIGH': return <Star className="w-3 h-3" />;
      case 'URGENT': return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'DESIGNER': return '🎨';
      case 'DEVELOPER': return '💻';
      case 'MARKETING': return '📢';
      case 'PROJECT_MANAGER': return '👨‍💼';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'DESIGNER': return 'bg-gradient-to-r from-pink-500 to-purple-500';
      case 'DEVELOPER': return 'bg-gradient-to-r from-green-500 to-blue-500';
      case 'MARKETING': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'PROJECT_MANAGER': return 'bg-gradient-to-r from-blue-600 to-indigo-600';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-500';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'DESIGNER': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'DEVELOPER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'MARKETING': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'PROJECT_MANAGER': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assigned Team ({assignments.length})
          </h3>
        </div>
        
        {canManageAssignments && (
          <Button
            onClick={() => setShowAddDialog(true)}
            size="sm"
            className="flex items-center gap-2"
            disabled={unassignedUsers.length === 0}
          >
            <Plus className="w-4 h-4" />
            {unassignedUsers.length === 0 ? 'No Available Members' : 'Add Member'}
          </Button>
        )}
      </div>

      {/* Available Users Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 p-3 rounded border">
          <div className="font-medium mb-2">Debug Info:</div>
          <div>Available users total: {availableUsers.length}</div>
          <div>Already assigned: {assignedUserIds.length} ({assignedUserIds.join(', ') || 'none'})</div>
          <div>Unassigned users: {unassignedUsers.length}</div>
          {availableUsers.length > 0 && (
            <div className="mt-2">
              <div className="font-medium">Available users list:</div>
              {availableUsers.map(user => (
                <div key={user.id} className="ml-2">
                  • {user.name} ({user.role}) - {assignedUserIds.includes(user.id) ? 'ALREADY ASSIGNED' : 'AVAILABLE'}
                </div>
              ))}
            </div>
          )}
          {unassignedUsers.length > 0 && (
            <div className="mt-2">
              <div className="font-medium text-green-600">Ready to assign:</div>
              {unassignedUsers.map(user => (
                <div key={user.id} className="ml-2 text-green-600">
                  • {user.name} ({user.role})
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-3">
        {assignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getRoleColor(assignment.user.role)}`}>
                    {assignment.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {assignment.user.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleBadgeColor(assignment.user.role)}>
                        {getRoleIcon(assignment.user.role)} {assignment.user.role}
                      </Badge>
                      {assignment.role && (
                        <Badge variant="outline" className="text-xs">
                          {assignment.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(assignment.status)}
                    <Badge className={getPriorityColor(assignment.priority)}>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(assignment.priority)}
                        {assignment.priority}
                      </div>
                    </Badge>
                  </div>
                </div>

                {assignment.workDescription && (
                  <div className={`mb-2 p-3 rounded-lg border-l-4 ${
                    assignment.user.role === 'DESIGNER' ? 'bg-pink-50 dark:bg-pink-950 border-pink-400' :
                    assignment.user.role === 'DEVELOPER' ? 'bg-green-50 dark:bg-green-950 border-green-400' :
                    assignment.user.role === 'MARKETING' ? 'bg-orange-50 dark:bg-orange-950 border-orange-400' :
                    'bg-blue-50 dark:bg-blue-950 border-blue-400'
                  }`}>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Working on:</strong> {assignment.workDescription}
                    </p>
                  </div>
                )}

                {assignment.progressNotes && (
                  <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded border-l-2 border-yellow-400">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Progress:</strong> {assignment.progressNotes}
                    </p>
                  </div>
                )}

                {/* Time tracking */}
                {(assignment.hoursEstimated || assignment.hoursWorked) && (
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {assignment.hoursEstimated && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Est: {assignment.hoursEstimated}h</span>
                      </div>
                    )}
                    {assignment.hoursWorked && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Worked: {assignment.hoursWorked}h</span>
                      </div>
                    )}
                    {assignment.hoursEstimated && assignment.hoursWorked && (
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${
                          assignment.hoursWorked > assignment.hoursEstimated ? 'text-red-600' :
                          assignment.hoursWorked === assignment.hoursEstimated ? 'text-green-600' :
                          'text-blue-600'
                        }`}>
                          {((assignment.hoursWorked / assignment.hoursEstimated) * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4">
                {canManageAssignments && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(assignment)}
                      disabled={isLoading}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Assignment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {assignment.user.name} from this project?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveAssignment(assignment.userId)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {assignments.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-600">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No team members assigned</p>
            <p className="text-xs mt-1">Add team members to get started</p>
          </div>
        )}
      </div>

      {/* Add Assignment Dialog */}
      {canManageAssignments && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {unassignedUsers.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No available team members</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    All available team members are already assigned to this project.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddDialog(false)}
                    className="mt-4"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <Label>Select User</Label>
                    <Select 
                      value={newAssignment.userId} 
                      onValueChange={(value) => setNewAssignment({...newAssignment, userId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {unassignedUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                                user.role === 'DESIGNER' ? 'bg-gradient-to-r from-pink-500 to-purple-500' :
                                user.role === 'DEVELOPER' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                                user.role === 'MARKETING' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                'bg-gradient-to-r from-blue-500 to-purple-500'
                              }`}>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className={`text-xs ${
                                  user.role === 'DESIGNER' ? 'text-pink-600' :
                                  user.role === 'DEVELOPER' ? 'text-green-600' :
                                  user.role === 'MARKETING' ? 'text-orange-600' :
                                  'text-gray-500'
                                }`}>
                                  {user.role === 'DESIGNER' ? '🎨 Designer' :
                                   user.role === 'DEVELOPER' ? '💻 Developer' :
                                   user.role === 'MARKETING' ? '📢 Marketing' :
                                   user.role}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Role in Project (Optional)</Label>
                    <Input
                      value={newAssignment.role || ''}
                      onChange={(e) => setNewAssignment({...newAssignment, role: e.target.value})}
                      placeholder={
                        newAssignment.userId ? 
                          (unassignedUsers.find(u => u.id === newAssignment.userId)?.role === 'DESIGNER' ? 
                            'e.g., UI Designer, UX Designer' :
                           unassignedUsers.find(u => u.id === newAssignment.userId)?.role === 'DEVELOPER' ?
                            'e.g., Frontend Developer, Backend Developer' :
                            'e.g., Lead Developer, UI Designer') :
                          'e.g., Lead Developer, UI Designer'
                      }
                    />
                  </div>

                  <div>
                    <Label>What they&apos;ll work on (Optional)</Label>
                    <Textarea
                      value={newAssignment.workDescription || ''}
                      onChange={(e) => setNewAssignment({...newAssignment, workDescription: e.target.value})}
                      placeholder={
                        newAssignment.userId ? 
                          (unassignedUsers.find(u => u.id === newAssignment.userId)?.role === 'DESIGNER' ? 
                            'e.g., Create wireframes, design user interface, user experience flow...' :
                           unassignedUsers.find(u => u.id === newAssignment.userId)?.role === 'DEVELOPER' ?
                            'e.g., Implement authentication, build API endpoints, frontend components...' :
                            'Describe what this person will be working on...') :
                          'Describe what this person will be working on...'
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priority</Label>
                      <Select 
                        value={newAssignment.priority} 
                        onValueChange={(value) => setNewAssignment({...newAssignment, priority: value as AssignmentPriority})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Estimated Hours (Optional)</Label>
                      <Input
                        type="number"
                        value={newAssignment.hoursEstimated || ''}
                        onChange={(e) => setNewAssignment({...newAssignment, hoursEstimated: e.target.value ? parseInt(e.target.value) : undefined})}
                        placeholder="Hours"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleAddAssignment} 
                      disabled={isLoading || !newAssignment.userId}
                      className="flex-1"
                    >
                      {isLoading ? 'Adding...' : 'Add Assignment'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddDialog(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Assignment Dialog */}
      {canManageAssignments && (
        editingAssignment && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Assignment - {editingAssignment.user.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Role in Project</Label>
                  <Input
                    value={editAssignment.role || ''}
                    onChange={(e) => setEditAssignment({...editAssignment, role: e.target.value})}
                    placeholder="e.g., Lead Developer, UI Designer"
                  />
                </div>

                <div>
                  <Label>What they&apos;re working on</Label>
                  <Textarea
                    value={editAssignment.workDescription || ''}
                    onChange={(e) => setEditAssignment({...editAssignment, workDescription: e.target.value})}
                    placeholder="Describe what this person is working on..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Progress Notes</Label>
                  <Textarea
                    value={editAssignment.progressNotes || ''}
                    onChange={(e) => setEditAssignment({...editAssignment, progressNotes: e.target.value})}
                    placeholder="Any progress updates or notes..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select 
                      value={editAssignment.priority} 
                      onValueChange={(value) => setEditAssignment({...editAssignment, priority: value as AssignmentPriority})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={editAssignment.status} 
                      onValueChange={(value) => setEditAssignment({...editAssignment, status: value as AssignmentStatus})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="PAUSED">Paused</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Estimated Hours</Label>
                    <Input
                      type="number"
                      value={editAssignment.hoursEstimated || ''}
                      onChange={(e) => setEditAssignment({...editAssignment, hoursEstimated: e.target.value ? parseInt(e.target.value) : undefined})}
                      placeholder="Hours"
                    />
                  </div>

                  <div>
                    <Label>Hours Worked</Label>
                    <Input
                      type="number"
                      value={editAssignment.hoursWorked || ''}
                      onChange={(e) => setEditAssignment({...editAssignment, hoursWorked: e.target.value ? parseInt(e.target.value) : undefined})}
                      placeholder="Hours"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleUpdateAssignment} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Updating...' : 'Update Assignment'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEditDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      )}
    </div>
  );
} 