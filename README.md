# Complaint Management System (CMCS)

A modern web application for managing and tracking citizen complaints with comprehensive administrative capabilities.

## Overview

CMCS is a Next.js-based platform designed to streamline complaint submission, tracking, and resolution across government entities. The system provides role-based access for administrators and agency users to efficiently manage complaints throughout their lifecycle.

## Features

### Core Functionality

- **Complaint Management**: Create, view, update, and track complaints with full history
- **Multi-role Access**: Admin and agency user roles with appropriate permissions
- **Real-time Analytics**: Dashboard with charts showing complaints by governorate, agency, and status
- **Search & Filter**: Advanced filtering by status, agency, and search terms
- **Attachment Support**: Upload and manage files associated with complaints

### Complaint Types

| Type | Description |
|------|-------------|
| ServiceQuality | Service quality issues |
| Corruption | Corruption-related complaints |
| Delay | Processing delays |
| Misconduct | Employee misconduct |
| Other | Other complaint types |

### Complaint Status

| Status | Description |
|--------|-------------|
| Pending | Complaint received, awaiting action |
| InProgress | Being actively processed |
| Completed | Resolved successfully |
| Rejected | Complaint rejected |

### Syrian Governorates

Supports all 14 Syrian governorates: Damascus, Rural Damascus, Aleppo, Homs, Hama, Latakia, Tartous, Idlib, Deir ez-Zor, Raqqa, Hasakah, Daraa, Suwayda, and Quneitra.

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 14.2.18 |
| React | 18 |
| TypeScript | 5.x |
| Tailwind CSS | 3.4 |
| Recharts | 2.15 |
| next-auth | 4.24 |

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/mohammad-alshiekh/complaints_management.git
cd complaint

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API configuration

# Run development server
npm run dev
```

The development server runs on port 8001 by default (`http://localhost:8001`).

## Configuration

Set the following environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://complaint.runasp.net/api
NEXTAUTH_URL=http://127.0.0.1:8001
NEXTAUTH_SECRET=your-secret-key
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (proxy to backend)
│   │   ├── auth/          # Authentication endpoints
│   │   ├── complaints/    # Complaint management
│   │   ├── admin/         # Admin operations
│   │   └── analytics/     # Analytics endpoints
│   ├── login/             # Login page
│   ├── complaints/          # Complaints list view
│   └── (dashboard)/       # Protected dashboard routes
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/                # Shadcn/ui components
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication helpers
│   ├── api.tsx            # API client
│   └── permissions.ts     # Role-based permissions
├── models/                # TypeScript interfaces
│   ├── complaint.ts       # Complaint data models
│   └── auth.ts            # Authentication models
└── enums/                 # Enum definitions
    └── index.ts           # Complaint types, statuses, roles
```

## User Roles

### Administrator (Admin)

Full access to all system features including:
- View all complaints across agencies
- Manage agency users
- Create/edit agencies
- Export complaint data
- Analytics dashboard

### Agency User (Employee)

Limited access to:
- View complaints assigned to their agency
- Update complaint status
- Add agency notes
- Request additional information from complainants

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@root.com | Admin@12345 |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8001 |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Complaints
- `GET /api/complaints` - List complaints with filters
- `GET /api/complaint/{id}` - Get complaint details
- `PUT /api/complaint/status` - Update complaint status
- `PUT /api/complaint/{id}` - Update complaint details
- `PUT /api/complaint/take-ownership/{id}` - Take ownership of complaint
- `PUT /api/complaint/release-ownership/{id}` - Release ownership

### Admin
- `GET /api/admin/users/all` - List all users
- `PUT /api/admin/users/{id}/activate` - Activate user
- `PUT /api/admin/users/{id}/deactivate` - Deactivate user
- `GET /api/admin/agencies` - List agencies
- `POST /api/admin/agencies` - Create agency
- `POST /api/admin/agency-users/create` - Create agency user

### Analytics
- `GET /api/analytics/by-governorate` - Complaints by governorate
- `GET /api/analytics/status-counts` - Complaints by status
- `GET /api/analytics/by-agency` - Complaints by agency

## Security

- JWT-based authentication
- Role-based access control
- Secure token storage in localStorage
- Automatic token injection for authenticated requests
- 30-second request timeout with abort handling

## License

MIT License