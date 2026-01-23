import axiosInstance from "../axiosInstance";
import type {
  AnnouncementDTO,
  PagedAnnouncementResponse,
  AnnouncementStats,
} from "../types/announcement.types";

const ANNOUNCEMENTS_API_BASE = "/announcements";

export const announcementService = {
  /**
   * Create a new announcement
   */
  async createAnnouncement(dto: AnnouncementDTO): Promise<AnnouncementDTO> {
    const response = await axiosInstance.post<AnnouncementDTO>(
      ANNOUNCEMENTS_API_BASE,
      dto,
    );
    return response.data;
  },

  /**
   * Update an existing announcement
   */
  async updateAnnouncement(
    id: number,
    dto: AnnouncementDTO,
  ): Promise<AnnouncementDTO> {
    const response = await axiosInstance.put<AnnouncementDTO>(
      `${ANNOUNCEMENTS_API_BASE}/${id}`,
      dto,
    );
    return response.data;
  },

  /**
   * Delete an announcement (soft delete)
   */
  async deleteAnnouncement(id: number): Promise<void> {
    await axiosInstance.delete(`${ANNOUNCEMENTS_API_BASE}/${id}`);
  },

  /**
   * Archive an announcement
   */
  async archiveAnnouncement(id: number): Promise<void> {
    await axiosInstance.patch(`${ANNOUNCEMENTS_API_BASE}/${id}/archive`);
  },

  /**
   * Unarchive an announcement
   */
  async unarchiveAnnouncement(id: number): Promise<void> {
    await axiosInstance.patch(`${ANNOUNCEMENTS_API_BASE}/${id}/unarchive`);
  },

  /**
   * Get announcement by ID
   */
  async getAnnouncementById(id: number): Promise<AnnouncementDTO> {
    const response = await axiosInstance.get<AnnouncementDTO>(
      `${ANNOUNCEMENTS_API_BASE}/${id}`,
    );
    return response.data;
  },

  /**
   * Get all announcements for an organization (paginated)
   */
  async getAllAnnouncements(
    organizationId: number,
    page: number = 0,
    size: number = 20,
  ): Promise<PagedAnnouncementResponse> {
    const response = await axiosInstance.get<PagedAnnouncementResponse>(
      `${ANNOUNCEMENTS_API_BASE}/organization/${organizationId}`,
      {
        params: { page, size },
      },
    );
    return response.data;
  },

  /**
   * Get pinned announcements for an organization (paginated)
   */
  async getPinnedAnnouncements(
    organizationId: number,
    page: number = 0,
    size: number = 20,
  ): Promise<PagedAnnouncementResponse> {
    const response = await axiosInstance.get<PagedAnnouncementResponse>(
      `${ANNOUNCEMENTS_API_BASE}/organization/${organizationId}/pinned`,
      {
        params: { page, size },
      },
    );
    return response.data;
  },

  /**
   * Get archived announcements for an organization (paginated)
   */
  async getArchivedAnnouncements(
    organizationId: number,
    page: number = 0,
    size: number = 20,
  ): Promise<PagedAnnouncementResponse> {
    const response = await axiosInstance.get<PagedAnnouncementResponse>(
      `${ANNOUNCEMENTS_API_BASE}/organization/${organizationId}/archived`,
      {
        params: { page, size },
      },
    );
    return response.data;
  },

  /**
   * Search announcements by keyword
   */
  async searchAnnouncements(
    organizationId: number,
    keyword: string,
    page: number = 0,
    size: number = 20,
  ): Promise<PagedAnnouncementResponse> {
    const response = await axiosInstance.get<PagedAnnouncementResponse>(
      `${ANNOUNCEMENTS_API_BASE}/organization/${organizationId}/search`,
      {
        params: { keyword, page, size },
      },
    );
    return response.data;
  },

  /**
   * Filter announcements by category, priority, and status
   */
  async filterAnnouncements(
    organizationId: number,
    filters: {
      category?: string;
      priority?: string;
      status?: string;
    },
    page: number = 0,
    size: number = 20,
  ): Promise<PagedAnnouncementResponse> {
    const response = await axiosInstance.get<PagedAnnouncementResponse>(
      `${ANNOUNCEMENTS_API_BASE}/organization/${organizationId}/filter`,
      {
        params: {
          ...filters,
          page,
          size,
        },
      },
    );
    return response.data;
  },

  /**
   * Toggle pin status of an announcement
   */
  async togglePin(id: number): Promise<void> {
    await axiosInstance.patch(`${ANNOUNCEMENTS_API_BASE}/${id}/toggle-pin`);
  },

  /**
   * Increment view count for an announcement
   */
  async incrementViews(id: number): Promise<void> {
    await axiosInstance.patch(
      `${ANNOUNCEMENTS_API_BASE}/${id}/increment-views`,
    );
  },

  /**
   * Increment reaction count for an announcement
   */
  async incrementReactions(id: number): Promise<void> {
    await axiosInstance.patch(
      `${ANNOUNCEMENTS_API_BASE}/${id}/increment-reactions`,
    );
  },

  /**
   * Get announcement statistics for an organization
   */
  async getAnnouncementStats(
    organizationId: number,
  ): Promise<AnnouncementStats> {
    const response = await axiosInstance.get<AnnouncementStats>(
      `${ANNOUNCEMENTS_API_BASE}/organization/${organizationId}/stats`,
    );
    return response.data;
  },
};
