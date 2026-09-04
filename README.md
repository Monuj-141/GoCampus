# ConnectCampus — Full-Stack Campus Management Platform

A role-based campus platform designed for managing campus events, official notices, student registrations, and student profiles.

Built with **React.js, Node.js, Express, MongoDB, and JWT Authentication**.

---

## 🌟 Key Features

### 🎓 Student Workflow
- **Campus Discovery**: Browse and search upcoming campus events and official notices with category filters and keyword search.
- **Event RSVP & Passes**: Register for events in 1 click; instant validation of capacity and duplicate RSVP prevention; view digital attendance passes with unique confirmation codes (`CC-2026-XXXX`).
- **Student Dashboard**: Real-time overview of registered events, upcoming dates, and notices published by campus departments.
- **RSVP Management**: Cancel registrations anytime; seats are automatically restored for other students.
- **Profile Management**: View and edit student details (Name, Phone, Department, Academic Year, Bio, Student ID) and change account password.

### 🛡️ Administrator Workflow
- **Admin Control Center**: Live campus metrics (Total Students, Active Events, Total Notices, Total Registrations, and Department breakdown).
- **Event Management**:
  - Create new events with title, category, capacity, date, time, location, organizer, and description.
  - Edit or delete existing events.
  - **View Attendees**: Inspect lists of registered students for any event (with full student contact details and registration pass codes).
- **Notice & Bulletin Board**:
  - Publish official announcements with priority levels (Urgent/Important flags), target departments, and rich content.
  - Edit and remove notices.
- **Student Registrations Audit**:
  - Searchable campus-wide directory of all student registrations across all events.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React.js (Vite), React Router v7, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express.js REST API
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing and role-based middleware (`protect`, `requireAdmin`)
- **Database**: MongoDB with Mongoose ODM
  - Features a **hybrid resilient connection**:
    - Connects to local `mongodb://127.0.0.1:27017/connectcampus` or remote MongoDB Atlas URI specified in `server/.env`.
    - Automatically falls back to an in-memory MongoDB runner if no external server is running, ensuring zero-configuration local operation.
    - Automatically seeds sample accounts, events, and notices on initial start.

---

## 🚀 Quick Start

### 1. Run Both Client & Server Concurrently
From the workspace root directory:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000/api`
- **Frontend App**: `http://localhost:5173`

### 2. Run Independently
**Backend**:
```bash
cd server
npm run dev
```

**Frontend**:
```bash
cd ConnectCampus
npm run dev
```

---

## 🔑 Demo Accounts (Pre-Seeded)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@connectcampus.edu` | `Admin@123` | Campus Dean & Administrator |
| **Student (Demo 1)** | `rahul@connectcampus.edu` | `Student@123` | Computer Science, 3rd Year |
| **Student (Demo 2)** | `priya@connectcampus.edu` | `Student@123` | Information Technology, 2nd Year |

> **Note**: The Login page includes **1-Click Demo Login** buttons for both Student and Admin roles for instant testing.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current user profile (Bearer token)
- `PUT /api/auth/profile` — Update user profile details (Bearer token)
- `PUT /api/auth/change-password` — Change password (Bearer token)

### Events (`/api/events`)
- `GET /api/events` — Get all events (supports `?search=`, `?category=`, `?status=`)
- `GET /api/events/:id` — Get event details & RSVP status for authenticated user
- `POST /api/events` — Create new event *(Admin only)*
- `PUT /api/events/:id` — Update event *(Admin only)*
- `DELETE /api/events/:id` — Delete event & associated registrations *(Admin only)*
- `GET /api/events/:id/attendees` — Get list of students registered for event *(Admin only)*

### Notices (`/api/notices`)
- `GET /api/notices` — Get campus notices (supports `?search=`, `?category=`, `?department=`, `?important=`)
- `GET /api/notices/:id` — Get single notice details
- `POST /api/notices` — Publish notice *(Admin only)*
- `PUT /api/notices/:id` — Update notice *(Admin only)*
- `DELETE /api/notices/:id` — Delete notice *(Admin only)*

### Registrations (`/api/registrations`)
- `POST /api/registrations/:eventId` — Register student for an event (capacity & duplicate checked)
- `DELETE /api/registrations/:eventId` — Cancel student registration
- `GET /api/registrations/my` — Get current student's registered events
- `GET /api/registrations/all` — Get all registrations across campus *(Admin only)*

### Analytics & Statistics (`/api/stats`)
- `GET /api/stats/overview` — Aggregated counts (students, events, notices, RSVPs, department breakdown)
