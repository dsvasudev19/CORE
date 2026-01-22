const axios = require('axios');
const logger = require('../utils/logger');

// Mock data for development
const MOCK_USERS = {
  'user1': { userId: 'user1', userName: 'Alice', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=user1' },
  'user2': { userId: 'user2', userName: 'Bob', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=user2' },
  'user3': { userId: 'user3', userName: 'Charlie', email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?u=user3' }
};

/**
 * Fetch user details from user service
 */
exports.fetchUserDetails = async (userId) => {
  try {
    // Mock implementation
    if (process.env.NODE_ENV === 'development' || !process.env.USER_SERVICE_URL) {
      return MOCK_USERS[userId] || { userId, userName: `User ${userId}`, avatar: null };
    }

    const response = await axios.get(
      `${process.env.USER_SERVICE_URL}/api/users/${userId}`
    );
    return response.data;
  } catch (error) {
    logger.error(`Error fetching user ${userId}:`, error.message);
    // Return minimal mock data on error to prevent app crash
    return { userId, userName: 'Unknown User', avatar: null };
  }
};

/**
 * Fetch multiple users
 */
exports.fetchUsers = async (userIds) => {
  try {
    // Mock implementation
    if (process.env.NODE_ENV === 'development' || !process.env.USER_SERVICE_URL) {
      return userIds.map(id => MOCK_USERS[id] || { userId: id, userName: `User ${id}`, avatar: null });
    }

    const response = await axios.post(
      `${process.env.USER_SERVICE_URL}/api/users/batch`,
      { userIds }
    );
    return response.data.users;
  } catch (error) {
    logger.error('Error fetching users:', error.message);
    return userIds.map(id => ({ userId: id, userName: 'Unknown User', avatar: null }));
  }
};

/**
 * Fetch team details from team service
 */
exports.fetchTeamDetails = async (teamId) => {
  try {
    // Mock implementation
    if (process.env.NODE_ENV === 'development' || !process.env.TEAM_SERVICE_URL) {
      return { id: teamId, name: 'Development Team', members: Object.keys(MOCK_USERS) };
    }

    const response = await axios.get(
      `${process.env.TEAM_SERVICE_URL}/api/teams/${teamId}`
    );
    return response.data;
  } catch (error) {
    logger.error(`Error fetching team ${teamId}:`, error.message);
    throw new Error('Failed to fetch team details');
  }
};

/**
 * Fetch team members with details
 */
exports.fetchTeamMembers = async (teamId, memberIds) => {
  try {
    // Mock implementation
    if (process.env.NODE_ENV === 'development' || !process.env.TEAM_SERVICE_URL) {
      return memberIds.map(id => MOCK_USERS[id] || { userId: id, userName: `User ${id}`, avatar: null });
    }

    const response = await axios.post(
      `${process.env.TEAM_SERVICE_URL}/api/teams/${teamId}/members/details`,
      { memberIds }
    );
    return response.data.members;
  } catch (error) {
    logger.error('Error fetching team members:', error.message);

    // Fallback: try to get user details directly
    try {
      return await exports.fetchUsers(memberIds);
    } catch (fallbackError) {
      logger.error('Fallback fetch also failed:', fallbackError.message);
      throw new Error('Failed to fetch team members');
    }
  }
};

/**
 * Fetch employee details from employee service
 */
exports.fetchEmployeeDetails = async (employeeId) => {
  try {
    // Mock implementation
    if (process.env.NODE_ENV === 'development' || !process.env.EMPLOYEE_SERVICE_URL) {
      return { id: employeeId, name: 'John Doe', role: 'Developer' };
    }

    const response = await axios.get(
      `${process.env.EMPLOYEE_SERVICE_URL}/api/employees/${employeeId}`
    );
    return response.data;
  } catch (error) {
    logger.error(`Error fetching employee ${employeeId}:`, error.message);
    throw new Error('Failed to fetch employee details');
  }
};

/**
 * Verify user has access to team
 */
exports.verifyTeamAccess = async (userId, teamId) => {
  try {
    // Mock implementation
    if (process.env.NODE_ENV === 'development' || !process.env.TEAM_SERVICE_URL) {
      return true;
    }

    const response = await axios.get(
      `${process.env.TEAM_SERVICE_URL}/api/teams/${teamId}/members/${userId}/verify`
    );
    return response.data.hasAccess;
  } catch (error) {
    logger.error('Error verifying team access:', error.message);
    return false;
  }
};
