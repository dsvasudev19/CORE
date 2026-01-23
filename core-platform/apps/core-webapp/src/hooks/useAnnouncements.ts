import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import { announcementService } from "../services/announcement.service";
import type { AnnouncementDTO } from "../types/announcement.types";

/**
 * Hook for fetching all announcements
 */
export const useAnnouncements = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.announcements.list(filters),
    queryFn: () => announcementService.getAllAnnouncements(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for fetching a single announcement
 */
export const useAnnouncement = (id: number) => {
  return useQuery({
    queryKey: queryKeys.announcements.detail(id),
    queryFn: () => announcementService.getAnnouncementById(id),
    enabled: !!id,
  });
};

/**
 * Hook for fetching pinned announcements
 */
export const usePinnedAnnouncements = () => {
  return useQuery({
    queryKey: queryKeys.announcements.pinned,
    queryFn: () => announcementService.getPinnedAnnouncements(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating an announcement
 */
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AnnouncementDTO>) =>
      announcementService.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });
};

/**
 * Hook for updating an announcement
 */
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<AnnouncementDTO>;
    }) => announcementService.updateAnnouncement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });
};

/**
 * Hook for deleting an announcement
 */
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
    },
  });
};

/**
 * Hook for pinning an announcement
 */
export const usePinAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementService.pinAnnouncement(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.pinned,
      });
    },
  });
};

/**
 * Hook for unpinning an announcement
 */
export const useUnpinAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementService.unpinAnnouncement(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.pinned,
      });
    },
  });
};

/**
 * Hook for marking announcement as read
 */
export const useMarkAnnouncementRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => announcementService.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.detail(id),
      });
    },
  });
};

/**
 * Hook for adding reaction to announcement
 */
export const useAddAnnouncementReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reaction }: { id: number; reaction: string }) =>
      announcementService.addReaction(id, reaction),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.detail(variables.id),
      });
    },
  });
};

/**
 * Hook for removing reaction from announcement
 */
export const useRemoveAnnouncementReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reaction }: { id: number; reaction: string }) =>
      announcementService.removeReaction(id, reaction),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.detail(variables.id),
      });
    },
  });
};
