# LegalSetu

> A privacy-focused legal help platform for Kerala that helps users discover relevant legal information, legal aid, and lawyers through a guided workflow.

## Overview

LegalSetu is a web application designed to make legal information and support services easier to discover and access in Kerala.

Users can describe their situation in natural language. LegalSetu identifies the relevant legal category, retrieves related information from a curated collection of official legal resources, and guides the user toward appropriate support options.

LegalSetu is an **information and service-routing platform, not an AI lawyer**. It does not replace qualified legal professionals or provide legal advice.

---

## Problem

Finding the right legal information or support can be difficult because:

- Legal information is spread across multiple government and legal-service websites.
- Users may not know which legal category their problem belongs to.
- Legal terminology can be difficult to understand.
- Users may not know whether they should seek legal aid, contact a lawyer, or review official information first.
- Important documents and application information can be difficult to organize.

LegalSetu aims to provide a simpler starting point.

---

## Solution

LegalSetu combines natural-language problem classification, retrieval-based search, official legal resources, and service routing into one platform.

The core workflow is:

```text
User describes a problem
        ↓
LegalSetu classifies the situation
        ↓
Relevant official resources are retrieved
        ↓
Information is presented in a simpler format
        ↓
User chooses an appropriate support route
        ↓
Legal aid / lawyer / application tracking
```

---

## Key Features

### 1. Legal Problem Classification

Users can describe their situation in natural language.

LegalSetu identifies the broad legal category and extracts useful context from the description.

Current areas include:

- Rental and tenancy
- Consumer issues
- Cyber and UPI fraud
- Family matters
- Domestic violence
- General legal-service queries

---

### 2. Official Legal Resource Retrieval

LegalSetu uses a retrieval-based approach to find relevant information from its curated legal-resource database.

Current resources include information related to:

- Kerala State Legal Services Authority (KeLSA)
- District Legal Services Authorities
- Free legal aid eligibility
- Legal Services Authorities Act
- Kerala Buildings (Lease and Rent Control) Act
- Cyber and UPI financial fraud reporting
- Consumer protection
- Protection from domestic violence
- Lok Adalat and related legal-service information

The system is designed to present source-backed information rather than generate unsupported legal conclusions.

---

### 3. Guided Clarification

When the initial description does not provide enough context, LegalSetu can ask follow-up questions.

The user's additional information is then used to improve the retrieval process and produce a more relevant result.

```text
Initial problem
      ↓
Classification
      ↓
Relevant resource retrieval
      ↓
Clarification questions
      ↓
User answers
      ↓
Updated retrieval
      ↓
Final result
```

---

### 4. Legal Aid

Users can explore legal-aid information and submit an application through the platform.

The application workflow includes:

- Application submission
- Application number generation
- Application status
- Application tracking
- Administrative review

---

### 5. Lawyer Directory

LegalSetu provides a lawyer directory containing information such as:

- Name
- Location
- Experience
- Languages
- Specialization

Users can search and filter available profiles and submit a request to contact a lawyer.

---

### 6. Lawyer Request Tracking

Authenticated users can view their submitted lawyer-contact requests and track their status.

Available statuses include:

- Pending
- Contacted
- Completed

---

### 7. Admin Management

Authenticated administrators can manage:

- Legal-aid applications
- Application status
- Lawyer contact requests
- Lawyer request status
- Relevant records

Role-based access control is implemented through Supabase Authentication and database policies.

---

## AI and Retrieval Architecture

LegalSetu uses a local AI and retrieval pipeline rather than relying on a hosted commercial LLM API.

### AI Stack

- Ollama
- Qwen 2.5 7B
- nomic-embed-text
- PostgreSQL
- pgvector
- Supabase

### Retrieval Pipeline

```text
User Query
    ↓
Local LLM Classification
    ↓
Query Embedding
    ↓
Vector Similarity Search
    ↓
Relevant Legal Resources
    ↓
Context Formatting
    ↓
User-Facing Result
```

The clarification workflow extends this process:

```text
Initial Problem
      ↓
Classification
      ↓
Resource Retrieval
      ↓
Clarification Questions
      ↓
User Answers
      ↓
Updated Query
      ↓
Embedding + Vector Search
      ↓
Relevant Official Resources
      ↓
Final Result
```

---

## Why RAG?

LegalSetu uses a retrieval-based approach to ground results in a curated collection of legal resources.

Instead of relying entirely on an LLM's internal knowledge, the application first retrieves relevant source material and uses that information to construct the result.

This approach helps to:

- Keep information tied to known sources
- Reduce unsupported generated content
- Improve relevance for specific legal topics
- Make source material easier for users to inspect

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React

### Backend and Platform

- Supabase
- PostgreSQL
- pgvector
- Supabase Auth
- Supabase Row Level Security (RLS)

### AI and Retrieval

- Ollama
- Qwen 2.5 7B
- nomic-embed-text
- Vector similarity search

### Maps

- Leaflet
- OpenStreetMap

### Deployment

- Vercel for the frontend
- Supabase for database, authentication, and backend services

---

## Security

LegalSetu handles user accounts, legal-aid applications, and lawyer-contact requests, so access control is an important part of the application.

The current implementation includes:

- Supabase Authentication
- Row Level Security (RLS)
- User-specific data access
- Protected application routes
- Role-based authorization
- Admin-only management operations
- Restricted database permissions
- Environment variables for client configuration
- `.env` excluded from Git tracking

Sensitive credentials should never be committed to the repository.

---

## Project Structure

```text
LegalSetu/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── ScrollToTop.jsx
│   │
│   ├── lib/
│   │   ├── auth.js
│   │   ├── embeddings.js
│   │   ├── legalAI.js
│   │   ├── legalPipeline.js
│   │   ├── supabase.js
│   │   └── utils.js
│   │
│   ├── pages/
│   │   ├── AdminApplication.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── ApplyAid.jsx
│   │   ├── Auth.jsx
│   │   ├── FindHelp.jsx
│   │   ├── Home.jsx
│   │   ├── LawyerProfile.jsx
│   │   ├── LawyerRequest.jsx
│   │   ├── Lawyers.jsx
│   │   ├── LegalAid.jsx
│   │   ├── LegalAidDetails.jsx
│   │   ├── MyLawyerRequests.jsx
│   │   ├── NotFound.jsx
│   │   ├── Results.jsx
│   │   ├── ServiceDetails.jsx
│   │   └── TrackApplication.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   └── index.css
│
├── generate-legal-embeddings.js
├── package.json
├── package-lock.json
├── vite.config.js
├── components.json
├── jsconfig.json
├── eslint.config.js
├── index.html
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Install the following:

- Node.js
- npm
- Git
- Supabase project
- Ollama

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/LegalSetu.git
cd LegalSetu
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit the `.env` file.

---

### 4. Set Up Ollama

Make sure Ollama is installed and running locally.

Pull the required models:

```bash
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
```

---

### 5. Start the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## Database

LegalSetu uses Supabase PostgreSQL.

The application stores and manages data including:

- User profiles
- Legal resources
- Lawyers
- Legal-aid applications
- Lawyer contact requests

Vector embeddings are stored using PostgreSQL's `pgvector` extension.

---

## Legal Resources

LegalSetu is designed around official and authoritative sources where possible.

Examples include:

- Kerala State Legal Services Authority
- National Legal Services Authority
- India Code
- National Consumer Helpline
- National Cyber Crime Reporting Portal
- District Legal Services Authorities

Users should verify important legal information through the relevant official source or consult a qualified legal professional.

---

## Important Disclaimer

LegalSetu provides access to legal information and service-routing features.

It does **not**:

- Act as a lawyer
- Establish an advocate-client relationship
- Provide professional legal advice
- Guarantee the correctness or outcome of a legal matter
- Replace consultation with a qualified legal professional

LegalSetu is intended to help users find relevant information and support services, not to replace professional legal assistance.

---

## Current Limitations

The current version is a project-stage implementation and has some limitations:

- The legal-resource database is curated rather than exhaustive.
- Lawyer profiles depend on the available directory data.
- Local Ollama models are currently used for AI processing.
- Production deployment requires an appropriate server-side AI architecture if local Ollama cannot be directly accessed from the deployed frontend.
- Legal information can change, so official sources should be checked for the latest requirements.

---

## Future Improvements

Potential future improvements include:

- Expanding the official legal-resource database
- Increasing coverage across Kerala districts
- Malayalam-first legal information workflows
- Improved multilingual retrieval
- Additional government legal-service integrations
- More detailed application notifications
- Document-assisted legal-resource retrieval
- Production-ready server-side AI inference
- Improved monitoring and audit logging

---

## Project Status

**Status: Active Development**

LegalSetu is being developed as an academic and portfolio project focused on improving access to legal information and legal-service discovery.

---

## Author

**Joel Jose**

B.Tech Artificial Intelligence & Data Science  
Amal Jyothi College of Engineering

---

## License

This project is currently intended for educational and portfolio purposes.

An appropriate open-source license should be added before distributing the project for reuse.