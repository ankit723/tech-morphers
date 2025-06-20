'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Download,
  RefreshCw,
  Video,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

interface ScheduledCall {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  projectBrief: string;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  duration: number;
  meetingLink?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';
  adminNotes?: string;
  clientNotes?: string;
  reminderSent: boolean;
  reminderSentAt?: string;
  followUpSent: boolean;
  followUpSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

const ScheduledCallsAdmin = () => {
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<ScheduledCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState<ScheduledCall | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  const fetchCalls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/scheduled-calls');
      const data = await response.json();
      
      if (data.success) {
        setCalls(data.calls);
        calculateStats(data.calls);
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (callsData: ScheduledCall[]) => {
    const stats = {
      total: callsData.length,
      scheduled: callsData.filter(c => c.status === 'SCHEDULED').length,
      confirmed: callsData.filter(c => c.status === 'CONFIRMED').length,
      completed: callsData.filter(c => c.status === 'COMPLETED').length,
      cancelled: callsData.filter(c => c.status === 'CANCELLED').length,
    };
    setStats(stats);
  };

  const filterCalls = useCallback(() => {
    let filtered = calls;

    if (searchTerm) {
      filtered = filtered.filter(call =>
        call.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.projectBrief.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.status === statusFilter);
    }

    setFilteredCalls(filtered);
  }, [calls, searchTerm, statusFilter]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  useEffect(() => {
    filterCalls();
  }, [filterCalls]);

  const updateCallStatus = async (callId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/scheduled-calls/${callId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes,
        }),
      });

      if (response.ok) {
        fetchCalls(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating call status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'RESCHEDULED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Calendar className="w-4 h-4" />;
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      case 'NO_SHOW': return <AlertCircle className="w-4 h-4" />;
      case 'RESCHEDULED': return <RefreshCw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Scheduled Calls
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track all scheduled consultation calls
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchCalls}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Calls"
          value={stats.total}
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          color="hover:shadow-md transition-shadow"
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          color="hover:shadow-md transition-shadow"
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="hover:shadow-md transition-shadow"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
          color="hover:shadow-md transition-shadow"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={<XCircle className="w-6 h-6 text-red-600" />}
          color="hover:shadow-md transition-shadow"
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, company, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
              <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading calls...</p>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No calls found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Scheduled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCalls.map((call) => (
                  <motion.tr
                    key={call.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {call.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {call.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {call.email}
                          </div>
                          {call.companyName && (
                            <div className="text-xs text-gray-400">
                              {call.companyName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(call.scheduledDate)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(call.scheduledTime)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {call.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {call.projectBrief}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusColor(call.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(call.status)}
                        {call.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCall(call);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {call.meetingLink && (
                            <DropdownMenuItem
                              onClick={() => window.open(call.meetingLink, '_blank')}
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join Meeting
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => updateCallStatus(call.id, 'CONFIRMED')}
                            disabled={call.status === 'CONFIRMED'}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateCallStatus(call.id, 'COMPLETED')}
                            disabled={call.status === 'COMPLETED'}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateCallStatus(call.id, 'CANCELLED')}
                            className="text-red-600"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Call Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
            <DialogDescription>
              Complete information about the scheduled call
            </DialogDescription>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Client Name</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedCall.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedCall.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedCall.phone}</p>
                  </div>
                  {selectedCall.companyName && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company</Label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCall.companyName}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Scheduled Date</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedCall.scheduledDate)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Time</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{formatTime(selectedCall.scheduledTime)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Duration</Label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedCall.duration} minutes</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className={`${getStatusColor(selectedCall.status)} w-fit`}>
                      {selectedCall.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-500">Project Brief</Label>
                <p className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {selectedCall.projectBrief}
                </p>
              </div>

              {selectedCall.adminNotes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Admin Notes</Label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {selectedCall.adminNotes}
                  </p>
                </div>
              )}

              {selectedCall.meetingLink && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Meeting Link</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={selectedCall.meetingLink} readOnly />
                    <Button
                      size="sm"
                      onClick={() => window.open(selectedCall.meetingLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledCallsAdmin; 