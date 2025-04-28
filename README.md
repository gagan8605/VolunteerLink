# VolunteerLink - Connecting Volunteers & Organizers


![image](https://github.com/user-attachments/assets/0e7cc3bb-245c-483b-80a3-949790f4b01d)


VolunteerLink is a full-stack web application designed to streamline the process of volunteer management. It provides a platform for non-profits and event organizers to create volunteering opportunities and for volunteers to find and sign up for events that match their interests and availability.

---

## ✨ Features

This platform offers distinct functionalities for both organizers (Admins) and Volunteers:

**For Event Organizers (Admins):**

*   🔑 **Secure Login:** Dedicated administrator login.
*   📅 **Event Creation & Management:** Easily create, update, view, and delete volunteer events (title, date, location, description).
*   💰 **Optional Stipend:** Specify if an event offers compensation/stipend to volunteers.
*   ✅ **Signup Management:** View lists of applicants per event, approve or reject applications.
*   💬 **Admin Feedback:** Send messages to volunteers upon approval/rejection or cancellation.
*   ❌ **Cancel Signups:** Cancel pending or approved volunteer signups with a reason.
*   👤 **View Volunteer Profiles:** Access detailed profiles of registered volunteers.
*   📊 **CSV Reporting:** Download participation reports for events.

**For Volunteers:**

*   🔑 **Secure Login & Detailed Registration:** Register with basic info plus volunteer-specific details (skills, availability, interests).
*   🔍 **Event Discovery:** Browse and search upcoming volunteer opportunities (search by location and/or date).
*   📄 **Apply for Events:** Simple application process for events.
*   📋 **My Events Dashboard:** Track application status (Pending, Approved, Rejected, Cancelled) and view admin messages/reasons.
*   ❌ **Cancel Signup:** Cancel own pending/approved signups before the event deadline (12 hours) with a reason.
*   👤 **Profile Management:** View and update basic contact information.

---

## 🎯 Project Objective & Scope

**Objective:** To create an efficient, centralized platform that simplifies the connection and coordination between event organizers needing volunteers and individuals seeking volunteering opportunities.

**Scope:**

*   User authentication and role management (Admin, Volunteer).
*   Full CRUD operations for events by Admins.
*   Volunteer application workflow including admin approval/rejection/cancellation with messaging.
*   Volunteer self-cancellation with time restrictions.
*   Basic profile management and viewing capabilities.
*   Event search functionality for volunteers.
*   CSV report generation for admins.
*   *Out of Scope (Current Version):* Advanced matching algorithms, real-time chat, payment processing, complex analytics dashboards, cloud file storage, advanced security (JWT/OAuth).

---

## 🛠️ Technologies Used

*   **Frontend:** ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) (TypeScript, HTML, CSS)
*   **Backend:** ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white) (Java)
*   **Database:** ![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
*   **API Style:** RESTful APIs

---

## 📋 Prerequisites & Setup

Before running this project, ensure you have the following installed:

*   **Java Development Kit (JDK):** Version 17 or later.
*   **Maven:** Version 3.6 or later (for building the backend).
*   **Node.js & npm:** Latest LTS version recommended (for running the frontend). Check compatibility with your Angular version.
*   **Angular CLI:** `npm install -g @angular/cli` (Use version compatible with the project, e.g., v17).
*   **MySQL Server:** Running instance of MySQL (v5.7 or v8.x recommended).

---

## ⚙️ Installation & Execution

**1. Database Setup:**

*   Connect to your MySQL server.
*   Create the database: `CREATE DATABASE volunteer_db_v2;` (or your chosen name).
*   *(Optional but recommended)* Create a dedicated user and grant privileges.
*   The tables will be created/updated automatically by Spring Boot JPA (`ddl-auto=update`) on first run. Alternatively, manually run the SQL script found in `Database Schema Section` (or provide path to your `.sql` file).

**2. Backend (Spring Boot):**

*   Navigate to the `volunteer-signup-backend` directory.
*   **Configure Database:** Open `src/main/resources/application.properties`.
    *   Update `spring.datasource.url` if your database name or host/port is different.
    *   Update `spring.datasource.username` and `spring.datasource.password` with your MySQL credentials.
*   **Build:** Run `mvn clean install`
*   **Run:** Execute `mvn spring-boot:run` or run the generated JAR file (`java -jar target/volunteer-signup-backend-*.jar`).
*   The backend server should start on `http://localhost:8080`.

**3. Frontend (Angular):**

*   Navigate to the `volunteer-signup-frontend` directory.
*   **Install Dependencies:** Run `npm install`.
*   **(Verify API URL):** Check `src/environments/environment.ts` and ensure `apiUrl` points to your running backend (e.g., `'http://localhost:8080/api'`).
*   **Run:** Execute `ng serve -o`.
*   This will build the frontend and open it in your default browser, usually at `http://localhost:4200`.

**4. Accessing the Application:**

*   Open `http://localhost:4200` in your browser.
*   Register as an Admin and/or Volunteer to start using the system.

---

## 🗄️ Database Schema Overview

**`users` Table:**

*   Stores core user information (ID, name, email, hashed password, role) and detailed profile fields for both Admins (organization, designation, etc.) and Volunteers (skills, availability, etc.). Uses nullable columns for role-specific data.

**`events` Table:**

*   Contains details about volunteering events (ID, title, date, description, location, stipend, creator ID).

**`volunteer_signups` Table:**

*   Links `users` (Volunteers) to `events`.
*   Tracks application status (`pending`, `approved`, `rejected`, `cancelled`).
*   Stores admin feedback/messages and cancellation reasons/timestamps.
*   Includes a unique constraint on `user_id` and `event_id`.

---

## 🚀 Future Scope

*   Advanced Event Filtering & Search (Skills, Radius, Cause).
*   Real-time Notifications (In-App, Email/SMS).
*   Skill-Based Volunteer Matching Suggestions.
*   Calendar Integration (iCal, Google Calendar).
*   Enhanced Admin Dashboards & Analytics.
*   Cloud Storage for Images (AWS S3, Azure Blob).
*   Robust Authentication (JWT/OAuth2).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE.md).


Thank you for checking out VolunteerLink!
