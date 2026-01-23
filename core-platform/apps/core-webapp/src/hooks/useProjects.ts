import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import projectService from '../services/project.service';
import { ProjectDTO } from '../types/project.types';

/**
 * Hook for fetching all projects
 */
export const useProjects = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: () => projectService.getAllProjects(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for fetching a single project
 */
export const useProject = (id: number) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
  });
};

/**
 * Hook for fetching project tasks
 */
export const useProjectTasks = (projectId: number) => {
  return useQuery({
    queryKey: queryKeys.projects.tasks(projectId),
    queryFn: () => projectService.getProjectTasks(projectId),
    enabled: !!projectId,
  });
};

/**
 * Hook for fetching project members
 */
export const useProjectMembers = (projectId: number) => {
  return useQuery({
    queryKey: queryKeys.projects.members(projectId),
    queryFn: () => projectService.getProjectMembers(projectId),
    enabled: !!projectId,
  });
};

/**
 * Hook for creating a project
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<ProjectDTO>) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
};

/**
 * Hook for updating a project
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProjectDTO> }) =>
      projectService.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
};

/**
 * Hook for deleting a project
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
};

/**
 * Hook for adding project member
 */
export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, userId, role }: { projectId: number; userId: number; role: string }) =>
      projectService.addMember(projectId, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.members(variables.projectId) });
    },
  });
};

/**
 * Hook for removing project member
 */
export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: number; userId: number }) =>
      projectService.removeMember(projectId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.members(variables.projectId) });
    },
  });
};
