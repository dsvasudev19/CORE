# Architecture Diagram - Backend-Frontend Integration

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    User Interface Layer                    │  │
│  │                                                             │  │
│  │  ┌─────────────────┐  ┌─────────────────┐                │  │
│  │  │   Recruitment   │  │  Sprint/Epic    │                │  │
│  │  │   Dashboard     │  │  Management     │                │  │
│  │  └────────┬────────┘  └────────┬────────┘                │  │
│  │           │                     │                          │  │
│  │  ┌────────▼────────┐  ┌────────▼────────┐                │  │
│  │  │  Job Postings   │  │  Sprint Board   │                │  │
│  │  │     List        │  │                 │                │  │
│  │  └────────┬────────┘  └────────┬────────┘                │  │
│  │           │                     │                          │  │
│  │  ┌────────▼────────┐  ┌────────▼────────┐                │  │
│  │  │  Candidates     │  │  Epic Backlog   │                │  │
│  │  │     List        │  │                 │                │  │
│  │  └─────────────────┘  └─────────────────┘                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │                    Service Layer                          │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ jobPosting   │  │   sprint     │  │    epic      │  │  │
│  │  │   .service   │  │  .service    │  │  .service    │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │  │
│  │         │                  │                  │           │  │
│  │  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐  │  │
│  │  │  candidate   │  │    issue     │  │              │  │  │
│  │  │   .service   │  │  .service    │  │   (others)   │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │                    HTTP Client (Axios)                    │  │
│  │                                                            │  │
│  │  • JWT Token Interceptor                                  │  │
│  │  • Error Handling                                         │  │
│  │  • Request/Response Transformation                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTP/REST
                                │ (JSON)
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                      Backend (Spring Boot)                       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Security Layer                          │  │
│  │                                                            │  │
│  │  • JWT Authentication Filter                              │  │
│  │  • Role-Based Authorization                               │  │
│  │  • CORS Configuration                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │                   Controller Layer                        │  │
│  │                                                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │ JobPosting   │  │   Sprint     │  │    Epic      │  │  │
│  │  │ Controller   │  │ Controller   │  │ Controller   │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │  │
│  │         │                  │                  │           │  │
│  │  ┌──────▼───────┐  ┌──────▼───────┐                     │  │
│  │  │  Candidate   │  │    Issue     │                     │  │
│  │  │ Controller   │  │ Controller   │                     │  │
│  │  └──────────────┘  └──────────────┘                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │                    Service Layer                          │  │
│  │                                                            │  │
│  │  • Business Logic                                         │  │
│  │  • Data Validation                                        │  │
│  │  • Transaction Management                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────▼───────────────────────────────┐  │
│  │                   Repository Layer                        │  │
│  │                                                            │  │
│  │  • JPA Repositories                                       │  │
│  │  • Custom Queries                                         │  │
│  │  • Data Access                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ JDBC
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                      Database (PostgreSQL)                       │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ job_postings │  │   sprints    │  │    epics     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  candidates  │  │    issues    │  │  employees   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└───────────────────────────────────────────────────────────────────┘
```

## Data Flow - Job Recruitment

```
User Action: "Create Job Posting"
     │
     ▼
┌─────────────────────────────┐
│ JobPostingList.tsx          │
│ - User fills form           │
│ - Clicks "Create"           │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ jobPosting.service.ts       │
│ - createJobPosting(dto)     │
│ - Adds JWT token            │
└────────────┬────────────────┘
             │
             ▼ HTTP POST /api/job-posting
┌─────────────────────────────┐
│ JobPostingController.java   │
│ - @PreAuthorize check       │
│ - Validates request         │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ JobPostingService.java      │
│ - Business logic            │
│ - Data validation           │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ JobPostingRepository.java   │
│ - JPA save operation        │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ PostgreSQL Database         │
│ - INSERT INTO job_postings  │
└────────────┬────────────────┘
             │
             ▼ Response flows back up
┌─────────────────────────────┐
│ JobPostingList.tsx          │
│ - Updates state             │
│ - Refreshes list            │
│ - Shows success message     │
└─────────────────────────────┘
```

## Data Flow - Sprint Management

```
User Action: "Start Sprint"
     │
     ▼
┌─────────────────────────────┐
│ SprintManagement.tsx        │
│ - User clicks "Start"       │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ sprint.service.ts           │
│ - startSprint(id)           │
│ - Adds JWT token            │
└────────────┬────────────────┘
             │
             ▼ HTTP PUT /api/sprint/{id}/start
┌─────────────────────────────┐
│ SprintController.java       │
│ - @PreAuthorize check       │
│ - Validates sprint state    │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ SprintService.java          │
│ - Check sprint status       │
│ - Update to ACTIVE          │
│ - Set start date            │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ SprintRepository.java       │
│ - JPA update operation      │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│ PostgreSQL Database         │
│ - UPDATE sprints            │
│   SET status = 'ACTIVE'     │
└────────────┬────────────────┘
             │
             ▼ Response flows back up
┌─────────────────────────────┐
│ SprintManagement.tsx        │
│ - Updates sprint status     │
│ - Shows "Active" badge      │
│ - Enables "Complete" button │
└─────────────────────────────┘
```

## Component Hierarchy

```
App
├── Router
│   ├── DashboardLayout
│   │   ├── RecruitmentDashboard
│   │   │   ├── Stats Cards
│   │   │   ├── Tab Navigation
│   │   │   └── Action Buttons
│   │   │
│   │   ├── JobPostingList
│   │   │   ├── Search & Filters
│   │   │   ├── Stats Summary
│   │   │   └── Job Table
│   │   │       ├── Job Row
│   │   │       └── Action Buttons
│   │   │
│   │   ├── CandidateList
│   │   │   ├── Search & Filters
│   │   │   └── Candidate Table
│   │   │       ├── Candidate Row
│   │   │       └── Action Buttons
│   │   │
│   │   └── SprintManagement
│   │       ├── Sprint Section
│   │       │   ├── Sprint Card
│   │       │   └── Sprint Modal
│   │       │
│   │       └── Epic Section
│   │           ├── Epic Card
│   │           └── Epic Modal
│   │
│   ├── EmployeeLayout
│   └── ClientLayout
```

## Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Service Pattern                       │
│                                                           │
│  1. Create Axios Instance                                │
│     const api = axios.create({                           │
│       baseURL: `${API_URL}/api/resource`,               │
│       headers: { 'Content-Type': 'application/json' }   │
│     });                                                   │
│                                                           │
│  2. Add Authentication Interceptor                       │
│     api.interceptors.request.use((config) => {          │
│       const token = localStorage.getItem('token');      │
│       if (token) {                                       │
│         config.headers.Authorization = `Bearer ${token}`;│
│       }                                                   │
│       return config;                                     │
│     });                                                   │
│                                                           │
│  3. Export Service Methods                               │
│     export const service = {                             │
│       create: async (data) => { ... },                  │
│       update: async (id, data) => { ... },              │
│       delete: async (id) => { ... },                    │
│       getById: async (id) => { ... },                   │
│       getAll: async (orgId) => { ... }                  │
│     };                                                    │
└─────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐
│  Login   │
│  Page    │
└────┬─────┘
     │ POST /api/auth/login
     │ { username, password }
     ▼
┌──────────────────┐
│  Auth Service    │
│  (Backend)       │
└────┬─────────────┘
     │ Validates credentials
     │ Generates JWT token
     ▼
┌──────────────────┐
│  Response        │
│  { token, user } │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  localStorage    │
│  .setItem(       │
│    'token',      │
│    jwt_token     │
│  )               │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  All subsequent  │
│  API calls       │
│  include token   │
│  in header       │
└──────────────────┘
```

## Error Handling Flow

```
API Call
   │
   ▼
┌─────────────────┐
│  Try Block      │
│  - API request  │
└────┬────────────┘
     │
     ├─ Success ──────────────┐
     │                         ▼
     │                    ┌─────────────┐
     │                    │ Update State│
     │                    │ Show Success│
     │                    └─────────────┘
     │
     └─ Error ────────────────┐
                              ▼
                         ┌─────────────┐
                         │ Catch Block │
                         │ - Log error │
                         │ - Set error │
                         │   state     │
                         └──────┬──────┘
                                │
                                ▼
                         ┌─────────────┐
                         │ Show Error  │
                         │ Message to  │
                         │ User        │
                         └─────────────┘
```

## State Management Pattern

```
Component Lifecycle:

1. Mount
   ├─ useState() - Initialize state
   ├─ useEffect() - Load data
   │  └─ setLoading(true)
   │
2. Data Loading
   ├─ API Call
   │  ├─ Success
   │  │  ├─ setData(response)
   │  │  └─ setLoading(false)
   │  │
   │  └─ Error
   │     ├─ setError(message)
   │     └─ setLoading(false)
   │
3. User Interaction
   ├─ Form Submit
   │  ├─ Validate Input
   │  ├─ API Call
   │  └─ Refresh Data
   │
   └─ Action Button
      ├─ Confirm Action
      ├─ API Call
      └─ Update UI
```

## Type Safety Flow

```
Backend (Java)
   │
   ├─ Domain Entity
   │  └─ JobPosting.java
   │
   ├─ DTO
   │  └─ JobPostingDTO.java
   │
   └─ Controller
      └─ Returns JobPostingDTO
         │
         │ JSON Response
         │
         ▼
Frontend (TypeScript)
   │
   ├─ Type Definition
   │  └─ jobPosting.types.ts
   │     ├─ interface JobPosting
   │     └─ interface JobPostingDTO
   │
   ├─ Service
   │  └─ jobPosting.service.ts
   │     └─ Returns Promise<JobPosting>
   │
   └─ Component
      └─ Uses JobPosting type
         └─ Type-safe operations
```

---

This architecture ensures:

- ✅ Clear separation of concerns
- ✅ Type safety end-to-end
- ✅ Secure authentication
- ✅ Consistent error handling
- ✅ Maintainable codebase
- ✅ Scalable structure
