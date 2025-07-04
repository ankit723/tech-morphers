"use client"

import { useState, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FolderKanban, 
  BarChart3, 
  Loader2,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from './components/UserManagement';
import { ProjectKanban } from './components/ProjectKanban';
import { ProjectManagerDashboard } from './components/ProjectManagerDashboard';
import { User, Project, UserWithStats, ResourceStats } from './types';
import { getCurrentAdminUser } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, startTransition] = useTransition();
  
  console.log(isLoading)

  useEffect(() => {
    startTransition(async () => {
      const fetchUser = async () => {
        const userResult = await getCurrentAdminUser();
        if (userResult.success) {
          setUser(userResult.user as User);
                  if(userResult.user?.role === UserRole.PROJECT_MANAGER) {
          setActiveTab('project-manager');
        } else if(userResult.user?.role !== UserRole.ADMIN) {
          setActiveTab('projects');
        }
        } else {
          setUser(null);
        }
      }
      fetchUser();
    });
  }, []);

  const loadData = async (showRefreshState = false) => {
    if (showRefreshState) setRefreshing(true);
    try {
      // Load users and projects in parallel
      const [usersResponse, projectsResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/projects')
      ]);

      const [usersData, projectsData] = await Promise.all([
        usersResponse.json(),
        projectsResponse.json()
      ]);

      if (usersData.success && projectsData.success) {
        const allUsers = usersData.users;
        const allProjects = projectsData.projects;

        // Calculate user stats
        const usersWithStats: UserWithStats[] = allUsers.map((user: User) => {
          const assignedProjects = allProjects.filter((p: Project) => p.assignedUserId === user.id);
          const completedProjects = assignedProjects.filter((p: Project) => p.projectStatus === 'COMPLETED');

          return {
            ...user,
            assignedProjectsCount: assignedProjects.length,
            completedProjectsCount: completedProjects.length
          };
        });

        // Calculate overall stats
        const resourceStats: ResourceStats = {
          totalUsers: allUsers.length,
          activeUsers: allUsers.filter((u: User) => u.isActive).length,
          totalProjects: allProjects.length,
          completedProjects: allProjects.filter((p: Project) => p.projectStatus === 'COMPLETED').length,
          pendingProjects: allProjects.filter((p: Project) => p.projectStatus !== 'COMPLETED').length,
          unassignedProjects: allProjects.filter((p: Project) => !p.assignedUserId).length
        };

        setUsers(usersWithStats);
        setProjects(allProjects);
        setStats(resourceStats);
      } else {
        console.error('Failed to load data:', usersData.error || projectsData.error);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      if (showRefreshState) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData(true);
  };

  const getChangeIcon = (current: number, total: number) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    if (percentage > 75) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (percentage < 25) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading Resources
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching users and projects data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Resource Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage users, projects, and team assignments
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {stats && user?.role === UserRole.ADMIN && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2">
                  {getChangeIcon(stats.activeUsers, stats.totalUsers)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {stats.activeUsers} active
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Projects
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalProjects}
                    </p>
                  </div>
                  <FolderKanban className="w-8 h-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2">
                  {getChangeIcon(stats.completedProjects, stats.totalProjects)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {stats.completedProjects} completed
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.pendingProjects}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Active projects
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats.completedProjects}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Delivered projects
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Unassigned
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {stats.unassignedProjects}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Need assignment
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Efficiency
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.totalProjects > 0 
                        ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
                        : 0
                      }%
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Completion rate
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full ${
          user?.role === UserRole.ADMIN ? 'grid-cols-4' : 
          user?.role === UserRole.PROJECT_MANAGER ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
          {user?.role === UserRole.ADMIN && (
            <>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="project-manager" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Project Manager
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Management
            </TabsTrigger>
            </>
          )}
          {user?.role === UserRole.PROJECT_MANAGER && (
            <TabsTrigger value="project-manager" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              My Dashboard
            </TabsTrigger>
          )}
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4" />
            Project Board
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.assignedProjectsCount} projects
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user.completedProjectsCount} completed
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {users.length > 5 && (
                    <div className="text-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('users')}
                      >
                        View All Users ({users.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5" />
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats?.completedProjects || 0}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Completed
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {stats?.pendingProjects || 0}
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        In Progress
                      </p>
                    </div>
                  </div>

                  {/* Recent projects */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Recent Projects
                    </h4>
                    {projects.slice(0, 4).map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.projectType || 'Untitled Project'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {project.client?.fullName || project.fullName}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                        >
                          {project.projectStatus.replace('_', ' ')}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('projects')}
                    >
                      View Project Board
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement 
            users={users} 
            onRefresh={handleRefresh} 
          />
        </TabsContent>

        <TabsContent value="project-manager" className="space-y-6">
          <ProjectManagerDashboard 
            users={users} 
            onRefresh={handleRefresh} 
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ProjectKanban 
            projects={projects} 
            users={users} 
            onRefresh={handleRefresh} 
            loading={refreshing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}