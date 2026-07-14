# Product Requirements Document (PRD) - EduManager

## 1. Project Overview
**Product Name:** EduManager - Student Management System
**Target Audience:** Educational Institution Administrators and Students.
**Objective:** To provide a comprehensive, streamlined platform for managing academic records, departments, courses, user permissions, and student-facing portal services.

---

## 2. Design System & Brand Identity
- **Design System:** Academic Core ({{DATA:DESIGN_SYSTEM:DESIGN_SYSTEM_1}})
- **Visual Style:** Professional, clean, and academic.
- **Color Palette:** Primary Navy Blue (#0f172a), Slate Grays, and crisp White surfaces.
- **Typography:** Inter (Sans-serif) for high legibility.
- **Components:** Standardized Sidebar (Admin), Top Navigation (Student), and unified Footers.

---

## 3. Screen Specifications

### 3.1. Authentication
- **Login Screen ({{DATA:SCREEN:SCREEN_24}}):**
    - **Purpose:** Secure access to the portal.
    - **Features:** Username/Email input, Password input, "Remember me" toggle, Forgot Password link.
    - **Brand:** Centered EduManager logo and academic icon.

### 3.2. Administrator Portal (Admin)
- **Dashboard Overview ({{DATA:SCREEN:SCREEN_2}}):**
    - **Purpose:** High-level institutional health metrics.
    - **Metrics:** Total Students, Departments, Courses, and Active Users.
    - **Visuals:** Enrollment trend charts (Student Growth) and distribution by faculty (Top Departments).
    - **Activity:** Recent system activities log.

- **Student Management ({{DATA:SCREEN:SCREEN_8}}):**
    - **Purpose:** Directory of all enrolled students.
    - **Features:** "Add New Student" action, global search, department/status filters.
    - **Data:** Student code, Full Name (with avatar), Gender, Birthday, Email, Department, and Status badges.

- **Student Detail ({{DATA:SCREEN:SCREEN_31}}):**
    - **Purpose:** Comprehensive individual student profile for admins.
    - **Tabs:** General Info, Academic Record, Enrollment History.
    - **Features:** "Edit Student", "Print Transcript", Financial Status indicator.

- **Department Management ({{DATA:SCREEN:SCREEN_25}}):**
    - **Purpose:** Oversight of academic faculties and research labs.
    - **Metrics:** Total Departments, Research Labs, Faculty Members.
    - **Table:** Department Name, Head of Department, Total Students/Courses, and Action buttons (Edit/Delete).

- **User Management ({{DATA:SCREEN:SCREEN_9}}):**
    - **Purpose:** System account and permission administration.
    - **Metrics:** Total Users, Admin Count, Active Online Sessions.
    - **Actions:** Add New User, Deactivate/Enable accounts, Reset Passwords.

- **User Detail ({{DATA:SCREEN:SCREEN_3}}):**
    - **Purpose:** Deep dive into specific staff/admin accounts.
    - **Settings:** Fine-grained Permission Settings (Access Student Records, Course Scheduling, etc.).
    - **History:** Recent Login History with IP, Location, and Device tracking.

- **Classroom Management ({{DATA:SCREEN:SCREEN_23}}):**
    - **Purpose:** Facility and resource scheduling.
    - **Metrics:** Total Capacity, Occupancy Rate (82%).
    - **Views:** Card-based inventory (Hall A-102, Lab C-305) and tabular Schedule Overview.

---

### 3.3. Student Portal
- **Student Dashboard ({{DATA:SCREEN:SCREEN_6}}):**
    - **Purpose:** Personal academic landing page.
    - **Identity:** Welcome banner with Student ID, Semester, and GPA/Credits summary.
    - **Current Flow:** "My Courses" table with quick access to academic transcripts.

- **My Profile ({{DATA:SCREEN:SCREEN_7}}):**
    - **Purpose:** Personal information and academic identity management.
    - **Sections:** Personal Info, Security (Password/2FA), Academic Path (Major/Minor/Advisor).
    - **ID:** Digital Student ID card view.

- **Student Profile (Public/Peer View) ({{DATA:SCREEN:SCREEN_17}}):**
    - **Purpose:** Professional academic presence within the institution.
    - **Features:** Bio/About section, Core Skills tags, Research Areas visualization, Active Projects showcase.

- **My Account Settings ({{DATA:SCREEN:SCREEN_27}}):**
    - **Purpose:** Security and integration management.
    - **Features:** Linked Accounts (Google/LinkedIn), Notification Preferences (Email/SMS/Push), Account Deletion.

- **Academic Departments ({{DATA:SCREEN:SCREEN_15}}):**
    - **Purpose:** Informational directory for students.
    - **Cards:** Detailed department descriptions, Head of Department contact, "View Curriculum" links.

- **Classrooms & Study Spaces ({{DATA:SCREEN:SCREEN_26}}):**
    - **Purpose:** Resource discovery for students.
    - **Features:** "Find a quiet spot" quick find, Room Type filters, interactive floor map link, and individual room status (Available/In Session).

---

## 4. Technical Requirements
- **Responsive Design:** Optimized for Desktop (1440px+).
- **Interactivity:** Data filtering, search real-time updates, tab switching in detail views.
- **State Management:** Consistent user sessions between Admin and Student portals.
- **Accessibility:** High contrast text, accessible form labels, and clear visual hierarchy.
