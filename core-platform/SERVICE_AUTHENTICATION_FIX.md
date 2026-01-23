# Service Authentication Fix Summary

## Problem

Multiple service files were using `axios` directly instead of the configured `axiosInstance`, which meant:

- No authentication tokens were being sent with requests
- Requests were failing with "Unexpected authentication error"
- Token refresh logic was not working
- Manual token management was duplicated across services

## Solution

Updated all service files to use `axiosInstance` which automatically:

- Adds `Authorization: Bearer <token>` header from localStorage
- Handles token refresh on 401 errors
- Redirects to login if refresh fails
- Provides consistent error handling

## Files Fixed

### 1. Payroll Services

- ✅ `payroll.service.ts` - Changed from axios to axiosInstance

### 2. Attendance Services

- ✅ `attendance.service.ts` - Changed from axios to axiosInstance

### 3. Performance Services

- ✅ `performanceReview.service.ts` - Changed from axios to axiosInstance
- ✅ `performanceReviewRequest.service.ts` - Changed from axios to axiosInstance
- ✅ `performanceCycle.service.ts` - Changed from axios to axiosInstance
- ✅ `performanceAnalytics.service.ts` - Changed from axios to axiosInstance

### 4. Leave Management Services

- ✅ `leaveRequest.service.ts` - Changed from axios to axiosInstance
- ✅ `leaveType.service.ts` - Changed from axios to axiosInstance
- ✅ `leaveBalance.service.ts` - Changed from axios to axiosInstance

### 5. Project Management Services

- ✅ `issue.service.ts` - Changed from axios to axiosInstance
- ✅ `epic.service.ts` - Changed from axios to axiosInstance
- ✅ `sprint.service.ts` - Changed from axios to axiosInstance

### 6. HR Services

- ✅ `jobPosting.service.ts` - Changed from axios to axiosInstance
- ✅ `candidate.service.ts` - Changed from axios to axiosInstance

### 7. Communication Services

- ✅ `announcement.service.ts` - Changed from axios to axiosInstance

## Changes Made to Each Service

### Before (Example):

```typescript
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_URL}/api/payroll`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Manual token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const payrollService = {
  getAllPayrolls: async (organizationId: number) => {
    const response = await api.get("", { params: { organizationId } });
    return response.data;
  },
};
```

### After:

```typescript
import axiosInstance from "../axiosInstance";

const PAYROLL_API_BASE = "/payroll";

export const payrollService = {
  getAllPayrolls: async (organizationId: number) => {
    const response = await axiosInstance.get(PAYROLL_API_BASE, {
      params: { organizationId },
    });
    return response.data;
  },
};
```

## Backend Changes

### SystemSeederService.java

Added missing resources to the RESOURCES list:

- `PAYROLL`
- `PAYROLL_HISTORY`
- `ATTENDANCE`
- `PERFORMANCE`

This ensures that permissions and policies are created for these resources during system initialization.

## Benefits

1. **Consistent Authentication**: All services now use the same authentication mechanism
2. **Automatic Token Refresh**: Token refresh is handled automatically by axiosInstance
3. **Reduced Code Duplication**: No need to manually add interceptors in each service
4. **Better Error Handling**: Centralized error handling and redirect logic
5. **Easier Maintenance**: Changes to authentication logic only need to be made in one place

## Testing

After these changes, verify that:

1. All API calls include the `Authorization` header
2. Token refresh works correctly on 401 errors
3. Users are redirected to login when tokens expire
4. All previously failing endpoints now work correctly

## Additional Notes

- The `axiosInstance` is configured in `src/axiosInstance.ts`
- It uses `VITE_API_BASE_URL` environment variable for the base URL
- Token is stored in localStorage as `accessToken`
- Refresh token is stored as `refreshToken`
