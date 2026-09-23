# CivicFix AI

> An AI-powered civic issue reporting and resolution platform that helps citizens report problems, automatically analyze them, detect duplicate complaints, prioritize issues, and connect them with the appropriate department.

---

## 1. Problem

Citizens often report civic problems such as:

- Potholes and damaged roads
- Broken streetlights
- Garbage and sanitation problems
- Water-related issues
- Drainage problems
- Public safety concerns

Traditional reporting systems can result in duplicate complaints, unclear prioritization, incorrect department assignment, and difficulty tracking whether an issue has actually been resolved.

CivicFix AI addresses these problems by combining **AI-powered complaint analysis, duplicate issue fusion, evidence analysis, and citizen verification** into one workflow.

---

## 2. Solution

CivicFix AI provides a complete workflow:

**Citizen Report → AI Analysis → Duplicate Detection → Master Issue → Priority → Department Assignment → Resolution → Citizen Verification**

Instead of treating every complaint as an independent issue, CivicFix AI identifies complaints that refer to the same real-world civic problem and groups them under a single **Master Issue**.

This allows authorities to work on the actual issue rather than managing multiple duplicate reports separately.

---

## 3. Key Features

### Citizen

- Register and log in securely
- Submit civic complaints
- Upload photographic evidence
- Optionally provide voice evidence
- Capture location using device geolocation
- Track submitted reports
- View AI-generated issue information
- Verify whether a fixed issue is actually resolved
- Reopen an issue when it is still not resolved

### AI-Powered Analysis

- Detect whether a report represents a civic issue
- Identify the issue category
- Analyze severity
- Assess safety risk
- Calculate AI confidence
- Process image evidence
- Process optional voice evidence
- Generate concise issue summaries
- Support multilingual complaint processing

### Duplicate Issue Fusion

CivicFix AI compares new complaints with existing nearby Master Issues using factors such as:

- Issue category
- Geographic location
- Description
- AI-generated summary
- Severity
- Relevant evidence

When complaints represent the same real-world issue, they are linked to the same Master Issue.

### Priority & Evidence

Issues are evaluated using:

- Severity
- Safety risk
- AI confidence
- Available evidence

The system calculates priority and evidence scores to help organize civic issues.

### Admin

Administrators can:

- View Master Issues
- Filter issues by status
- View department assignment
- View total reports linked to an issue
- View active reports
- Track issue location
- Move issues through the resolution workflow

---

## 4. Complete Workflow

```text
Citizen submits complaint
          ↓
AI analyzes complaint
          ↓
Category + Severity + Safety + Confidence
          ↓
Duplicate / Same-Issue Detection
          ↓
   ┌───────────────┐
   │ Existing issue│
   └───────┬───────┘
           │
      Same Issue?
       /       \
     Yes        No
      ↓          ↓
   Merge      Create
   Report     Master Issue
      \          /
       \        /
        ↓      ↓
       Priority Calculation
              ↓
       Department Assignment
              ↓
           REPORTED
              ↓
         IN_PROGRESS
              ↓
            FIXED
              ↓
      Citizen Verification
          /           \
        Yes            No
         ↓              ↓
      CLOSED         REOPENED
                        ↓
                   IN_PROGRESS
                        ↓
                      FIXED
```

A Master Issue is closed only after all linked complaints have been successfully verified as resolved.

---

## 5. System Architecture

```text
┌─────────────────────┐
│      Citizen        │
│   React Frontend    │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ↓
┌─────────────────────┐
│   Express Backend   │
│ Authentication      │
│ Complaint Workflow  │
│ Master Issues       │
│ Admin Workflow      │
└───────┬───────┬─────┘
        │       │
        │       │
        ↓       ↓
┌───────────┐  ┌────────────────┐
│  MySQL    │  │   AI Pipeline  │
│ Database  │  │                │
└───────────┘  │ Complaint      │
               │ Image          │
               │ Voice          │
               │ Fusion         │
               │ Evidence       │
               │ Priority       │
               └───────┬────────┘
                       │
                       ↓
                  Groq AI Models

Image / Voice Evidence
          │
          ↓
       ImageKit
```

---

## 6. Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS

### Backend

- Node.js
- Express 5
- JWT authentication
- bcryptjs
- Multer
- Sharp
- MySQL2

### Database

- MySQL

### AI

- Groq SDK
- AI-powered complaint analysis
- Image analysis
- Voice processing
- Issue fusion
- Evidence analysis
- Priority calculation

### Media Storage

- ImageKit

---

## 7. Project Structure

```text
CivicFix-AI/
│
├── ai/
│   ├── complaintAnalysis/
│   ├── imageAnalysis/
│   ├── issueFusion/
│   ├── evidenceEngine/
│   ├── priorityEngine/
│   └── ...
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── config/
│   ├── tests/
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── docs/
│
├── package.json
└── README.md
```

---

## 8. Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MySQL
- Git

You also need API/service credentials for the AI and media-storage services used by the project.

---

## 9. Installation

Clone the repository:

```bash
git clone https://github.com/Rohan7207/CivicFix-AI.git
cd CivicFix-AI
```

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

## 10. Database Setup

Create a MySQL database named:

```text
civicfix
```

Then execute:

```text
database/schema.sql
```

The database contains the main entities required for the CivicFix workflow, including:

- Users
- Departments
- Master Issues
- Complaints
- Complaint Evidence
- AI Analysis

---

## 11. Environment Variables

The project uses environment variables for configuration and service credentials.

Create the required environment files according to the configuration expected by the backend and AI modules.

Do **not** commit real credentials, API keys, database passwords, JWT secrets, or service credentials to GitHub.

Typical services used by CivicFix AI include:

```text
MySQL
Groq
ImageKit
JWT
Frontend / Backend configuration
```

> Never place real API keys or passwords in the README.

---

## 12. Running the Project

### Start Backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on the configured server port.

For production-style startup:

```bash
npm start
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will provide the local frontend URL.

---

## 13. API

The frontend communicates with the backend through REST APIs.

Major API areas include:

### Authentication

```text
/api/auth
```

Handles:

- Registration
- Login
- Authentication

### Complaints

```text
/api/complaints
```

Handles:

- Creating complaints
- Listing complaints
- Viewing complaint details
- Complaint verification
- Complaint status operations

### Master Issues

```text
/api/master-issues
```

Handles:

- Master Issue retrieval
- Department filtering
- Master Issue status workflow

Authentication and role-based authorization are applied to protected operations.

---

## 14. AI Pipeline

CivicFix AI separates AI processing into focused stages.

### Complaint Analysis

Analyzes the complaint and determines information such as:

- Is it a civic issue?
- Category
- Severity
- Safety risk
- Confidence
- Department
- Summary
- Language / translation

### Image Analysis

Uses uploaded image evidence to extract useful information for the complaint analysis and evidence evaluation process.

### Voice Analysis

Optional voice evidence can be processed to extract complaint information.

### Issue Fusion

Compares a new complaint against nearby existing Master Issues.

The system considers geographic proximity and AI-generated issue information to determine whether the complaint belongs to an existing issue.

### Evidence Engine

Combines available evidence to calculate an evidence score and level.

### Priority Engine

Uses issue severity and available evidence to calculate issue priority.

---

## 15. Master Issue Concept

A **Master Issue** represents a real-world civic problem.

For example:

```text
Complaint 1
"Large pothole near the main road"
             │
             ↓
        Master Issue
             ↑
             │
Complaint 2
"Road damaged at the same location"
```

Instead of creating two separate operational issues, both complaints can be linked to the same Master Issue.

The Master Issue keeps track of:

- Issue code
- Department
- Severity
- Priority
- Evidence
- Status
- Total reports
- Active reports

This reduces duplicate operational work while preserving individual citizen reports.

---

## 16. Status Lifecycle

### Master Issue

```text
REPORTED
    ↓
IN_PROGRESS
    ↓
FIXED
    ↓
Citizen Verification
    ↓
CLOSED / REOPENED
```

Administrators manage the operational states:

```text
REPORTED → IN_PROGRESS → FIXED
```

Citizen verification determines whether an individual complaint becomes:

```text
FIXED → CLOSED
```

or:

```text
FIXED → REOPENED
```

If a complaint is reopened, the associated Master Issue is also reopened.

Already closed complaints remain closed when another linked complaint is reopened.

---

## 17. Security

The application uses:

- JWT-based authentication
- HTTP-only authentication cookies
- Password hashing with bcrypt
- Role-based authorization
- Protected admin operations
- Request validation
- File type and size validation
- Server-side complaint validation

Uploaded media is stored externally through ImageKit rather than directly inside the database.

---

## 18. Validation & Evidence Rules

Complaint submissions support:

- Mandatory photo evidence
- Optional voice evidence
- Optional description
- Required latitude and longitude
- Optional address

Supported media is validated before processing.

Image processing also performs optimization before storage where applicable.

---

## 19. Testing

The backend contains automated tests under:

```text
server/tests/
```

Run backend tests with:

```bash
cd server
npm test
```

The complete CivicFix workflow has been tested end-to-end, including:

1. Citizen complaint creation
2. AI analysis
3. Master Issue creation
4. Duplicate complaint fusion
5. Admin status updates
6. Citizen verification
7. Complaint reopening
8. Master Issue reopening
9. Final closure after all linked complaints are verified

---

## 20. Demo Flow

For a hackathon demonstration, the recommended flow is:

### Step 1 — Citizen 1

Submit a civic complaint with:

- Photo
- Location
- Description

Show the AI-generated analysis and Master Issue.

### Step 2 — Citizen 2

Submit another complaint describing the same real-world problem from the same area.

Show that CivicFix AI identifies it as the same issue and links it to the existing Master Issue.

### Step 3 — Admin

Open the Admin dashboard and demonstrate:

```text
REPORTED
    ↓
IN_PROGRESS
    ↓
FIXED
```

Show the total and active report counts.

### Step 4 — Citizen Verification

Citizen 1 verifies that the issue is fixed.

Show:

```text
Complaint 1 → CLOSED
```

while another active linked complaint remains unresolved.

### Step 5 — Reopening

Citizen 2 reports that the problem still exists.

Show:

```text
Complaint 2 → REOPENED
Master Issue → REOPENED
```

### Step 6 — Final Resolution

Admin resolves the issue again and Citizen 2 confirms it is fixed.

Show:

```text
All complaints → CLOSED
Master Issue → CLOSED
```

This demonstrates the complete CivicFix workflow.

---

## 21. Challenges Addressed

### Duplicate Reports

Multiple citizens can report the same real-world issue.

**Solution:** AI-powered issue fusion links related complaints to a Master Issue.

### Issue Prioritization

Not every civic issue has the same urgency.

**Solution:** Severity, safety risk, confidence, and evidence are used in priority calculation.

### Department Assignment

Different issues need different departments.

**Solution:** AI analysis identifies the appropriate department category.

### Resolution Verification

An administrator marking an issue fixed does not necessarily mean the citizen considers it resolved.

**Solution:** Citizens verify the result and can reopen the complaint when the issue remains unresolved.

### Multiple Citizen Reports

Different citizens may have different experiences with the same issue.

**Solution:** Each complaint maintains its own status while remaining connected to the shared Master Issue.

---

## 22. What We Learned

Through CivicFix AI, the project demonstrates practical integration of:

- React frontend development
- REST API design
- MySQL relational data modeling
- JWT authentication
- File upload and media processing
- AI integration
- AI-based duplicate detection
- Evidence and priority scoring
- Role-based workflows
- Citizen feedback loops
- End-to-end system integration

---

## 23. Future Improvements

Potential future improvements include:

- Live deployment
- Interactive civic issue maps
- Real-time administrator notifications
- Advanced geospatial duplicate detection
- Department-specific dashboards
- Analytics and reporting
- More sophisticated multilingual voice support
- Improved AI confidence and explainability
- Mobile application support

---

## 24. AI Assistance Disclosure

AI development tools were used as development assistance during the project for activities such as:

- Brainstorming
- Debugging assistance
- Code suggestions
- Documentation assistance
- Development workflow support

The project architecture, integration, implementation decisions, testing, and final product were developed and validated by the project team.

---

## 25. Team

**CivicFix AI**

A hackathon project focused on improving the way civic issues are reported, organized, resolved, and verified.

---

## 26. License

This project was created as a hackathon project.
