# Legal Scale - Development Documentation

This document serves as a comprehensive guide for developers working on the `legal-scale-frontend` project. It outlines the architectural decisions, role definitions, API structure, and core workflows used throughout the application.

---

## 🏗️ System Architecture

The application is built using a modern React framework architecture:

1. **Next.js App Router**: Utilizing the modern `app/` directory structure for routing, allowing nested layouts, collocated data fetching, and improved server-side rendering support.
2. **Context API for Auth**: Authentication and user roles are globally managed by `AuthContext`. It wraps the entire application within the root layout, enabling conditionally rendered routes and UI elements based on the parsed JWT claims.
3. **Axios Interceptors**: The application communicates with a backend REST API. Communication is abstracted through a centralized Axios instance (`lib/axios.ts`) which manages base URLs, paths, and handles interceptors for injecting JWT tokens into requests.

---

## 👥 Roles and Permissions

Legal Scale utilizes strict Role-Based Access Control (RBAC). The following roles are implemented:

- **Admin (`app/(ui)/admin/`)**
  - Manage application access.
  - Ban/unban users.
  - Modify user roles and authority levels.
  - View overall user statistics.

- **Supervisor (`app/(ui)/supervisor/`)**
  - Create and initialize legal cases.
  - View all newly created cases.
  - Assign cases to Legal Officers.
  - Overview activities and track case remarks.
  - View, approve, or reject supervisor-level agreements.
  - Digitally sign finalized agreements.

- **Officer (`app/(ui)/officer/`)**
  - Work directly on assigned legal cases.
  - Add internal comments, activities, and remarks.
  - Transition case statuses based on progression.
  - Review preliminary agreements.
  - Address and respond to agreement revisions.

- **Manager (`app/(ui)/manager/`)**
  - High-level oversight.
  - Access to summary dashboards encompassing the count of cases and agreement statuses.

- **User (`app/(ui)/user/`)**
  - Standard system participants.
  - View user-specific information.

---

## 🔌 API Implementation Structure

All API calls are centralized within `lib/axios.ts`. The structure groups endpoints logic by feature or role:

```typescript
export const API_PATHS = {
  AUTH: { ... },        // Register, Login, Me, Logout
  ADMIN: { ... },       // User management & metric counts
  DOC: { ... },         // Document downloading endpoints
  CASE: { ... },        // Universal case attachments
  SUPERVISOR: { ... },  // Case assignments, commenting, supervisor agreements
  OFFICER: { ... },     // Case progress, officer agreements, revisions
  MANAGEMENT: { ... },  // Organization-wide statistical aggregates
  AGREEMENT: { ... }    // Generic agreement CRUD operations
};
```

This ensures predictable URL resolutions and centralized configurations for headers and base URLs.

---

## 💻 Tech Choices Explained

### Tailwind & Class Variance Authority (CVA)
To keep component styling robust and typed, the project relies on **Tailwind CSS**. Reusable components use **CVA (`class-variance-authority`)** and `clsx` integrated with `tailwind-merge` to handle UI states securely (e.g., primary buttons vs destructive buttons) without suffering from CSS class collision.

### State & Forms
**Formik** coupled with **Yup** is primarily used for handling complex forms like Login, Case Creation, Document Upload, and Agreement revisions. This handles field validation logic synchronously with the UI correctly.

### Notification System
**Sonner** is implemented at the root level (`layout.tsx`) as the primary toast notification method, providing interactive, context-aware success and error feedbacks to users when operating on forms or changing statuses.

### Theming
**next-themes** wraps the application to gracefully handle Dark/Light mode toggles according to the user's system preferences or manual selection, avoiding hydration mismatch errors on render.

---

## 🔄 Core Workflows

### 1. Case Lifecycle Flow
1. **Creation**: Supervisor creates a case.
2. **Assignment**: Supervisor views new cases and designates an Officer.
3. **Investigation**: Officer adds remarks, works on the case, changes statuses.
4. **Resolution**: Officer completes case items, concluding the workflow.

### 2. Agreement Lifecycle Flow
1. **Drafting**: System user/role drafts an agreement.
2. **Reviewing**: Officer reviews the agreement (`REQUEST_REVIEW`).
3. **Revisions**: Revisions act as a communication channel; Officers respond to them (`RESPONSE_REVISION`).
4. **Approval**: Agreement is pushed to Supervisor for `APPROVAL` or rejection.
5. **Finalization**: Agreement is signed (`SIGN`).

---

## 📝 Conventions and Best Practices

- **Routing:** Use `(ui)` for grouping related dashboard pages without affecting the URL path (e.g., `localhost:3000/supervisor/cases` will reside in `app/(ui)/supervisor/cases/page.tsx`).
- **Icons:** Use **Lucide React** for consistent SVG-based iconography.
- **Client Components:** Add `"use client"` directive strictly only on the files that utilize hooks (e.g., `useState`, `useEffect`) or context, maximizing Next.js's server-component performance benefits for standard display files.
- **Environment variables:** Use `NEXT_PUBLIC_` for variables that are absolutely required to be exposed in the browser. Store backend secrets securely.
