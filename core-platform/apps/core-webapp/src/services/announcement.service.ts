import axios from "axios";
import type {
  AnnouncementDTO,
  PagedAnnouncementResponse,
  AnnouncementStats,
} from "../types/announcement.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const announcementService = {
  /**
   * Create a new announcement
   */
  async createAnnouncement(dto: AnnouncementDTO): Promise<AnnouncementDTO> {
    const response = await axios.post<AnnouncementDTO>(
      `${API_URL}/api/announcements`,
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
    const response = await axios.put<AnnouncementDTO>(
      `${API_URL}/api/announcements/${id}`,
      dto,
    );
    return response.data;
  },

  /**
   * Delete an announcement (soft delete)
   */
  async deleteAnnouncement(id: number): Promise<void> {
    await axios.delete(`${API_URL}/api/announcements/${id}`);
  },

  /**
   * Archive an announcement
   */
  async archiveAnnouncement(id: number): Promise<void> {
    await axios.patch(`${API_URL}/api/announcements/${id}/archive`);
  },

  /**
   * Get announcement by ID
   */
  async getAnnouncementById(id: number): Promise<AnnouncementDTO> {
    const response = await axios.get<AnnouncementDTO>(
      `${API_URL}/api/announcements/${id}`,
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
    const response = await axios.get<PagedAnnouncementResponse>(
      `${API_URL}/api/announcements/organization/${organizationId}`,
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
    const response = await axios.get<PagedAnnouncementResponse>(
      `${API_URL}/api/announcements/organization/${organizationId}/pinned`,
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
    const response = await axios.get<PagedAnnouncementResponse>(
      `${API_URL}/api/announcements/organization/${organizationId}/archived`,
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
    const response = await axios.get<PagedAnnouncementResponse>(
      `${API_URL}/api/announcements/organization/${organizationId}/search`,
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
    const response = await axios.get<PagedAnnouncementResponse>(
      `${API_URL}/api/announcements/organization/${organizationId}/filter`,
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
    await axios.patch(`${API_URL}/api/announcements/${id}/toggle-pin`);
  },

  /**
   * Increment view count for an announcement
   */
  async incrementViews(id: number): Promise<void> {
    await axios.patch(`${API_URL}/api/announcements/${id}/increment-views`);
  },

  /**
   * Increment reaction count for an announcement
   */
  async incrementReactions(id: number): Promise<void> {
    await axios.patch(`${API_URL}/api/announcements/${id}/increment-reactions`);
  },

  /**
   * Get announcement statistics for an organization
   */
  async getAnnouncementStats(
    organizationId: number,
  ): Promise<AnnouncementStats> {
    const response = await axios.get<AnnouncementStats>(
      `${API_URL}/api/announcements/organization/${organizationId}/stats`,
    );
    return response.data;
  },
};
