# Payroll Permissions Fix

## Problem
The payroll endpoints were throwing "Unexpected authentication error" for all users, including SUPER_ADMIN, because the PAYROLL resource was not configured in the system seeder.

## Root Cause
The `SystemSeederService.java` was missing `PAYROLL` and `PAYROLL_HISTORY` from the `RESOURCES` list, which meant:
- No PAYROLL resource was created in the database
- No PAYROLL permissions were generated
- No PAYROLL policies were created for any role
- The `PolicyAuthorizationFilter` failed when trying to authorize payroll endpoints

## Solution

### Option 1: Quick Fix (Run SQL Script)
If you don't want to restart the application, run the SQL script to add the missing resources and permissions:

```bash
# Connect to your MySQL database
mysql -u root -p core_db < core-platform/scripts/add-payroll-permissions.sql
```

This script will:
- Create PAYROLL and PAYROLL_HISTORY resources
- Create all CRUD permissions for these resources
- Assign permissions to SUPER_ADMIN, ORG_ADMIN, and PROJECT_MANAGER roles
- Create the necessary policy entries

### Option 2: Restart Application (Recommended for Clean State)
The `SystemSeederService.java` has been updated to include PAYROLL resources. Simply restart the core-service:

```bash
cd core-platform/services/core-service
./mvnw spring-boot:run
```

The seeder will automatically create all missing resources, permissions, and policies on startup.

## Changes Made

### 1. Updated SystemSeederService.java
Added PAYROLL resources to the RESOURCES list:
```java
private static final List<String> RESOURCES = Arrays.asList(
    // ... existing resources ...
    "PAYROLL", "PAYROLL_HISTORY"
);
```

### 2. Updated Role Permission Matrix
Added PAYROLL permissions to PROJECT_MANAGER role:
```java
matrix.put("PROJECT_MANAGER", Set.of(
    // ... existing permissions ...
    "PAYROLL:READ", "PAYROLL_HISTORY:READ"
));
```

### 3. Created SQL Migration Script
Created `add-payroll-permissions.sql` for manual database updates without restart.

## Verification

After applying the fix, verify that payroll endpoints work:

```bash
# Test getting payrolls (replace with your actual token and org ID)
curl -X GET "http://localhost:8080/api/payroll/organization/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

You should receive a successful response instead of an authentication error.

## Affected Endpoints
All payroll endpoints should now work correctly:
- `GET /api/payroll/organization/{organizationId}`
- `GET /api/payroll/{id}`
- `POST /api/payroll`
- `PUT /api/payroll/{id}`
- `DELETE /api/payroll/{id}`
- And all other payroll-related endpoints

## Role Permissions
- **SUPER_ADMIN**: Full CRUD access to PAYROLL and PAYROLL_HISTORY
- **ORG_ADMIN**: Full CRUD access to PAYROLL and PAYROLL_HISTORY
- **PROJECT_MANAGER**: Read-only access to PAYROLL and PAYROLL_HISTORY
- **Other roles**: No access (can be configured as needed)
