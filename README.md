# LegalSetu

> A privacy-focused legal help platform for Kerala that helps users discover relevant legal information, legal aid, and lawyers through a simple, guided workflow.

## Overview

LegalSetu is a web application designed to make access to legal information and support services easier for people in Kerala.

Instead of expecting users to understand legal terminology or know where to start, LegalSetu takes a user's situation, identifies the relevant area of law, retrieves related information from a curated collection of official legal resources, and guides the user toward appropriate support options.

LegalSetu is an **information and service-routing platform, not an AI lawyer**. It does not replace qualified legal professionals or provide legal advice.

---

## Problem

Finding the right legal information or support can be difficult because:

- Legal information is often spread across multiple government and legal-service websites.
- Users may not know which legal category their problem belongs to.
- Legal terminology can be difficult to understand.
- People may not know whether they should seek legal aid, contact a lawyer, or simply review official information first.
- Important documents and application information can be difficult to organize.

LegalSetu aims to provide a simpler starting point.

---

## What LegalSetu Does

The platform provides a guided workflow:

```text
User describes a problem
        ↓
LegalSetu classifies the situation
        ↓
Relevant official resources are retrieved
        ↓
Information is presented in a simpler format
        ↓
User can choose an appropriate support route
        ↓
Legal aid / lawyer / application tracking

Key Features
1. Legal Problem Classification
Users can describe their situation in natural language.
The application identifies the broad legal category and extracts useful context from the description.
Supported areas include situations related to:
- Rental and tenancy
- Consumer issues
- Cyber and UPI fraud
- Family matters
- Domestic violence
- General legal-service queries
2. Official-Resource Retrieval
LegalSetu uses a retrieval-based approach to find relevant information from its curated legal-resource database.
Resources currently include information related to:
- Kerala State Legal Services Authority (KeLSA)
- District Legal Services Authorities
- Free legal aid eligibility
- Legal Services Authorities Act
- Kerala Buildings (Lease and Rent Control) Act
- Cyber and UPI financial fraud reporting
- Consumer protection
- Protection from domestic violence
- Lok Adalat and related legal-service information
The application is designed to present source-backed information rather than generate unsupported legal conclusions.
3. Guided Clarification
If the initial description does not provide enough context, LegalSetu can ask follow-up questions.
The additional information is then used to improve the retrieval process and produce a more relevant result.
4. Legal Aid
Users can explore legal-aid information and submit an application through the platform.
The application workflow includes:
- Application submission
- Application number generation
- Application status
- Application tracking
- Administrative review
5. Lawyer Directory
LegalSetu provides a lawyer directory containing profile information such as:
- Name
- Location
- Experience
- Languages
- Specialization
Users can search and filter the available profiles and submit a request to contact a lawyer.
6. Lawyer Request Tracking
Authenticated users can view their submitted lawyer-contact requests and track their current status.
Possible statuses include:
Pending
Contacted
Completed

7. Admin Management
An authenticated administrator can manage:
- Legal-aid applications
- Application status
- Lawyer contact requests
- Lawyer request status
- Deletion of relevant records
Role-based access control is implemented through Supabase authentication and database policies.
AI and Retrieval Architecture
LegalSetu uses a local AI and retrieval pipeline rather than relying on a hosted commercial LLM API.
Current AI stack
- Ollama
- Qwen 2.5 7B
- nomic-embed-text
- PostgreSQL + pgvector
- Supabase
The general pipeline is:
User Query
    ↓
Local LLM classification
    ↓
Query embedding
    ↓
Vector similarity search
    ↓
Relevant legal resources
    ↓
Context formatting
    ↓
User-facing result

For clarification workflows:
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

Why RAG?
LegalSetu uses a retrieval-based approach so that the system can ground its responses in a curated collection of legal resources.
Rather than asking an LLM to answer a legal question entirely from its internal knowledge, the application first retrieves relevant source material and uses that information to construct the result.
This helps the application:
- Keep information tied to known sources
- Reduce unsupported generated content
- Improve relevance for specific legal topics
- Make the source material easier for users to inspect
Technology Stack
Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React
Backend / Platform
- Supabase
- PostgreSQL
- pgvector
- Supabase Auth
- Supabase Row Level Security
AI / Retrieval
- Ollama
- Qwen 2.5 7B
- nomic-embed-text
- Vector similarity search
Maps
- Leaflet
- OpenStreetMap
Deployment
- Vercel for the frontend
- Supabase for database, authentication, and backend services
Security
Security is an important part of LegalSetu because the application handles user accounts, applications, and lawyer-contact requests.
The current implementation includes:
- Supabase Authentication
- Row Level Security (RLS)
- User-specific data access
- Admin-only management operations
- Protected application routes
- Role-based authorization
- Restricted database permissions
- Environment variables for client configuration
- .env excluded from Git tracking
Sensitive credentials should never be committed to the repository.
Project Structure
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
├── vite.config.js
├── .gitignore
└── README.md

Getting Started
Prerequisites
Make sure the following are installed:
- Node.js
- npm
- Git
- Supabase project
- Ollama
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/LegalSetu.git
cd LegalSetu

2. Install dependencies
npm install

3. Configure environment variables
Create a .env file in the project root:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Do not commit the .env file.
4. Start Ollama
Make sure Ollama is installed and running locally.
Pull the required models:
ollama pull qwen2.5:7b
ollama pull nomic-embed-text

5. Start the development server
npm run dev

The application will normally be available at:
http://localhost:5173

Database
LegalSetu uses Supabase PostgreSQL.
The database contains application data including:
- User profiles
- Legal resources
- Lawyers
- Legal-aid applications
- Lawyer contact requests
Vector embeddings are stored using PostgreSQL's pgvector extension.
Legal Resources
LegalSetu is designed around official and authoritative sources where possible.
Examples include:
- Kerala State Legal Services Authority
- National Legal Services Authority
- India Code
- National Consumer Helpline
- National Cyber Crime Reporting Portal
- District Legal Services Authorities
The application should always be treated as a starting point for finding information and services, not as a substitute for professional legal advice.
Important Disclaimer
LegalSetu provides access to legal information and service-routing features.
It does not:
- Act as a lawyer
- Establish an advocate-client relationship
- Provide professional legal advice
- Guarantee the correctness or outcome of a legal matter
- Replace consultation with a qualified legal professional
Users should verify important legal information through the relevant official source or consult a qualified lawyer.
Current Limitations
The current version is a project-stage implementation and has some limitations:
- The legal-resource database is curated rather than exhaustive.
- Lawyer profiles depend on the available directory data.
- Local Ollama models are currently used for AI processing.
- Production deployment requires an appropriate server-side AI architecture if local Ollama cannot be directly accessed.
- Legal information can change, so official sources should be checked for the latest requirements.
Future Improvements
Potential future improvements include:
- Expansion of the official legal-resource database
- More comprehensive coverage of Kerala districts
- Malayalam-first legal information workflows
- Improved multilingual retrieval
- Additional government legal-service integrations
- More detailed application notifications
- Better document-assisted legal-resource retrieval
- Production-ready server-side AI inference
- Improved monitoring and audit logging
Project Status
Status: Active development
LegalSetu is being developed as an academic and portfolio project focused on improving access to legal information and legal-service discovery.
Author
Joel Jose
B.Tech Artificial Intelligence & Data Science
Amal Jyothi College of Engineering
License
This project is intended for educational and portfolio purposes.
Add an appropriate open-source license before distributing the project for reuse.

### One important thing

I intentionally **didn't put fake badges, fake statistics, fake accuracy numbers, or claims like "AI-powered legal advice."** Those make a student README look polished for five minutes and suspicious for five seconds.

This version tells a recruiter exactly what the project is, **what you built, how the RAG pipeline works, the security model, and what remains unfinished**.

Next, we should put this into your actual `README.md`, then commit it to GitHub.