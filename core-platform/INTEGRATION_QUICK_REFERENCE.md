# Backend-Frontend Integration Quick Reference

## Newly Integrated Features

### 1. Job Recruitment System

**Access Points:**

- Dashboard: `/a/recruitment`
- Job Postings: `/a/recruitment/jobs`
- Candidates: `/a/recruitment/candidates`

**Key Services:**

```typescript
import { jobPostingService } from "@/services/jobPosting.service";
import { candidateService } from "@/services/candidate.service";

// Get all job postings
const jobs = await jobPostingService.getAllJobPostings(organizationId);

// Get all candidates
const candidates = await candidateService.getAllCandidates(organizationId);

// Publish a job
await jobPostingService.publishJobPosting(jobId);

// Shortlist a candidate
await candidateService.shortlistCandidate(candidateId);
```

**User Roles:**

- ADMIN, HR: Full access
- EMPLOYEE: View-only access to active job postings

### 2. Sprint & Epic Management

**Access Points:**

- Sprint Management: `/a/sprints`
- Sprint Board: `/a/sprint-board`
- Epic Management: `/a/epic-management`

**Key Services:**

```typescript
import { sprintService } from "@/services/sprint.service";
import { epicService } from "@/services/epic.service";
import { issueService } from "@/services/issue.service";

// Create a sprint
const sprint = await sprintService.createSprint({
  name: "Sprint 1",
  goal: "Complete authentication",
  startDate: "2025-01-01",
  endDate: "2025-01-14",
  status: SprintStatus.PLANNING,
  projectId: 1,
  organizationId: 1,
});

// Start a sprint
await sprintService.startSprint(sprintId);

// Create an epic
const epic = await epicService.createEpic({
  key: "PROJ-1",
  name: "User Authentication",
  description: "Complete auth system",
  color: "#6554C0",
  status: EpicStatus.IN_PROGRESS,
  projectId: 1,
  organizationId: 1,
});

// Create an issue
const issue = await issueService.createIssue({
  key: "PROJ-101",
  summary: "Implement login",
  type: IssueType.STORY,
  priority: IssuePriority.HIGH,
  status: IssueStatus.TO_DO,
  storyPoints: 5,
  epicId: 1,
  projectId: 1,
  organizationId: 1,
});

// Move issue to sprint
await issueService.moveToSprint(issueId, sprintId);
```

**User Roles:**

- ADMIN, PROJECT_MANAGER: Full access
- EMPLOYEE: View and update assigned issues

## API Endpoints Summary

### Job Recruitment

| Endpoint                        | Method | Description           | Auth                |
| ------------------------------- | ------ | --------------------- | ------------------- |
| `/api/job-posting`              | POST   | Create job posting    | ADMIN, HR           |
| `/api/job-posting/{id}`         | PUT    | Update job posting    | ADMIN, HR           |
| `/api/job-posting/{id}`         | DELETE | Delete job posting    | ADMIN, HR           |
| `/api/job-posting/{id}`         | GET    | Get job posting       | ADMIN, HR, EMPLOYEE |
| `/api/job-posting`              | GET    | Get all job postings  | ADMIN, HR, EMPLOYEE |
| `/api/job-posting/active`       | GET    | Get active jobs       | ADMIN, HR, EMPLOYEE |
| `/api/job-posting/{id}/publish` | PUT    | Publish job           | ADMIN, HR           |
| `/api/job-posting/{id}/close`   | PUT    | Close job             | ADMIN, HR           |
| `/api/candidate`                | POST   | Create candidate      | Public              |
| `/api/candidate/{id}`           | PUT    | Update candidate      | ADMIN, HR           |
| `/api/candidate/{id}`           | DELETE | Delete candidate      | ADMIN, HR           |
| `/api/candidate/{id}`           | GET    | Get candidate         | ADMIN, HR           |
| `/api/candidate`                | GET    | Get all candidates    | ADMIN, HR           |
| `/api/candidate/job/{jobId}`    | GET    | Get candidates by job | ADMIN, HR           |
| `/api/candidate/{id}/shortlist` | PUT    | Shortlist candidate   | ADMIN, HR           |
| `/api/candidate/{id}/reject`    | PUT    | Reject candidate      | ADMIN, HR           |
| `/api/candidate/{id}/hire`      | PUT    | Hire candidate        | ADMIN, HR           |

### Sprint & Epic Management

| Endpoint                                    | Method | Description            | Auth                |
| ------------------------------------------- | ------ | ---------------------- | ------------------- |
| `/api/sprint`                               | POST   | Create sprint          | ADMIN, PM           |
| `/api/sprint/{id}`                          | PUT    | Update sprint          | ADMIN, PM           |
| `/api/sprint/{id}`                          | DELETE | Delete sprint          | ADMIN, PM           |
| `/api/sprint/{id}`                          | GET    | Get sprint             | ADMIN, PM, EMPLOYEE |
| `/api/sprint`                               | GET    | Get all sprints        | ADMIN, PM, EMPLOYEE |
| `/api/sprint/project/{projectId}`           | GET    | Get sprints by project | ADMIN, PM, EMPLOYEE |
| `/api/sprint/{id}/start`                    | PUT    | Start sprint           | ADMIN, PM           |
| `/api/sprint/{id}/complete`                 | PUT    | Complete sprint        | ADMIN, PM           |
| `/api/sprint/active`                        | GET    | Get active sprints     | ADMIN, PM, EMPLOYEE |
| `/api/epic`                                 | POST   | Create epic            | ADMIN, PM           |
| `/api/epic/{id}`                            | PUT    | Update epic            | ADMIN, PM           |
| `/api/epic/{id}`                            | DELETE | Delete epic            | ADMIN, PM           |
| `/api/epic/{id}`                            | GET    | Get epic               | ADMIN, PM, EMPLOYEE |
| `/api/epic`                                 | GET    | Get all epics          | ADMIN, PM, EMPLOYEE |
| `/api/epic/project/{projectId}`             | GET    | Get epics by project   | ADMIN, PM, EMPLOYEE |
| `/api/issue`                                | POST   | Create issue           | ADMIN, PM, EMPLOYEE |
| `/api/issue/{id}`                           | PUT    | Update issue           | ADMIN, PM, EMPLOYEE |
| `/api/issue/{id}`                           | DELETE | Delete issue           | ADMIN, PM           |
| `/api/issue/{id}`                           | GET    | Get issue              | ADMIN, PM, EMPLOYEE |
| `/api/issue`                                | GET    | Get all issues         | ADMIN, PM, EMPLOYEE |
| `/api/issue/sprint/{sprintId}`              | GET    | Get issues by sprint   | ADMIN, PM, EMPLOYEE |
| `/api/issue/epic/{epicId}`                  | GET    | Get issues by epic     | ADMIN, PM, EMPLOYEE |
| `/api/issue/backlog`                        | GET    | Get backlog issues     | ADMIN, PM, EMPLOYEE |
| `/api/issue/{id}/move-to-sprint/{sprintId}` | PUT    | Move to sprint         | ADMIN, PM           |
| `/api/issue/{id}/move-to-backlog`           | PUT    | Move to backlog        | ADMIN, PM           |
| `/api/issue/{id}/assign/{employeeId}`       | PUT    | Assign issue           | ADMIN, PM           |
| `/api/issue/{id}/status`                    | PUT    | Change status          | ADMIN, PM, EMPLOYEE |

## Type Definitions

### Job Recruitment Types

```typescript
enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
}

enum JobStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  ON_HOLD = "ON_HOLD",
}

enum JobUrgency {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

enum CandidateStatus {
  NEW = "NEW",
  UNDER_REVIEW = "UNDER_REVIEW",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  INTERVIEWED = "INTERVIEWED",
  OFFER_EXTENDED = "OFFER_EXTENDED",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

enum CandidateStage {
  INITIAL_SCREENING = "INITIAL_SCREENING",
  PHONE_SCREENING = "PHONE_SCREENING",
  TECHNICAL_ROUND = "TECHNICAL_ROUND",
  HR_ROUND = "HR_ROUND",
  FINAL_ROUND = "FINAL_ROUND",
  OFFER_NEGOTIATION = "OFFER_NEGOTIATION",
  BACKGROUND_CHECK = "BACKGROUND_CHECK",
}
```

### Sprint & Epic Types

```typescript
enum SprintStatus {
  PLANNING = "PLANNING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

enum EpicStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

enum IssueType {
  STORY = "STORY",
  TASK = "TASK",
  BUG = "BUG",
  EPIC = "EPIC",
}

enum IssuePriority {
  HIGHEST = "HIGHEST",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
  LOWEST = "LOWEST",
}

enum IssueStatus {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
  CANCELLED = "CANCELLED",
}
```

## Environment Configuration

Required environment variables:

```env
# Backend API URL
VITE_API_URL=http://localhost:8080

# Optional: WebSocket URL for real-time updates
VITE_WS_URL=ws://localhost:8080/ws
```

Required localStorage items:

- `token`: JWT authentication token
- `organizationId`: Current organization ID
- `userId`: Current user ID (optional)

## Common Patterns

### Error Handling

```typescript
try {
  const data = await jobPostingService.getAllJobPostings(organizationId);
  setJobPostings(data);
} catch (err: any) {
  console.error("Failed to load job postings:", err);
  setError(err.message || "Failed to load data");
}
```

### Loading States

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await service.getData();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

### Modal Forms

```typescript
const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

const openModal = (item: Item | null = null) => {
  setSelectedItem(item);
  if (item) {
    setFormData({ ...item });
  } else {
    resetForm();
  }
  setShowModal(true);
};

const handleSave = async () => {
  try {
    if (selectedItem) {
      await service.update(selectedItem.id, formData);
    } else {
      await service.create(formData);
    }
    setShowModal(false);
    loadData();
  } catch (err) {
    alert("Failed to save");
  }
};
```

## Testing

### Manual Testing Steps

1. **Job Recruitment:**
   - Navigate to `/a/recruitment`
   - Create a new job posting
   - Publish the job
   - Add a candidate application
   - Shortlist the candidate
   - Schedule an interview

2. **Sprint Management:**
   - Navigate to `/a/sprints`
   - Create a new sprint
   - Create an epic
   - Create issues and assign to epic
   - Start the sprint
   - Move issues between sprints
   - Complete the sprint

### API Testing with curl

```bash
# Get all job postings
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/job-posting?organizationId=1

# Create a sprint
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Sprint 1","status":"PLANNING","projectId":1,"organizationId":1}' \
  http://localhost:8080/api/sprint
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if token is present in localStorage
   - Verify token hasn't expired
   - Ensure user has correct role permissions

2. **404 Not Found**
   - Verify API_URL is correct
   - Check if backend service is running
   - Confirm endpoint path matches controller

3. **CORS Errors**
   - Ensure backend CORS configuration allows frontend origin
   - Check if credentials are being sent correctly

4. **Data Not Loading**
   - Check browser console for errors
   - Verify organizationId is set correctly
   - Ensure backend database has data

## Next Steps

1. Implement real-time updates using WebSockets
2. Add file upload for resumes and attachments
3. Create detailed candidate profile pages
4. Build sprint burndown charts
5. Add drag-and-drop issue management
6. Implement email notifications
7. Create analytics dashboards
