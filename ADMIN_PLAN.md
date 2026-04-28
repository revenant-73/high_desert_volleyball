# Admin Dashboard Implementation Plan (Turso + Astro)

This plan outlines the steps to build a lightweight, secure admin panel to manage events and venues using your Turso database.

## 1. Authentication
*   **Method**: Simple password-based protection using Astro Middleware and a session cookie or JWT.
*   **Implementation**: Create an `/admin/login` page and a middleware that protects all `/admin/*` routes (except login).

## 2. API Endpoints (Astro Server Endpoints)
Create server-side routes to handle CRUD operations to keep database credentials secure:
*   `POST /api/events`: Create/Update events.
*   `DELETE /api/events/[id]`: Remove events.
*   `POST /api/venues`: Create/Update venues.
*   `DELETE /api/venues/[id]`: Remove venues.

## 3. Admin UI Components (React)
Build reusable management interfaces in `src/components/admin/`:
*   **DashboardLayout**: Sidebar navigation for Events and Venues.
*   **DataTable**: A generic component to list records with Edit/Delete actions.
*   **RecordForm**: A form component for creating and editing records, with validation.

## 4. Pages Structure
*   `src/pages/admin/index.astro`: Dashboard overview.
*   `src/pages/admin/events.astro`: Event management listing and create/edit forms.
*   `src/pages/admin/venues.astro`: Venue management listing and create/edit forms.
*   `src/pages/admin/login.astro`: Authentication page.

## 5. Technology Stack
*   **Database**: Turso (libsql)
*   **Frontend**: React + Tailwind CSS (using existing components)
*   **Icons**: Lucide React
*   **State Management**: React `useState`/`useTransition` for form handling.

## 6. Implementation Phases
1.  **Phase 1: Setup Security**: Implement the login page and middleware protection.
2.  **Phase 2: Events Management**: Build the list and form view for Events.
3.  **Phase 3: Venues Management**: Build the list and form view for Venues.
4.  **Phase 4: Optimization**: Add feedback toasts, loading states, and error handling.
