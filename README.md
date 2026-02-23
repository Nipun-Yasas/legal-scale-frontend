# Legal Scale

**Legal Scale** is an Integrated Legal Management System designed for Legal Case Handling and Agreement Approval Management. It provides a unified digital platform to manage legal cases, workflows, and document approvals seamlessly, securely, and transparently.

## 🚀 Features

- **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for Admins, Managers, Supervisors, Officers, and regular Users.
- **Case Management:** Create, assign, comment on, and track the status of legal cases.
- **Agreement Workflows:** Robust agreement drafting, reviewing, revision, and approval processes.
- **Document Management:** Securely upload, attach, and download case/agreement-related documents.
- **Real-time Notifications:** In-app toast notifications using Sonner.
- **Theming:** Full light/dark mode support using Next-Themes.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/) & `tailwindcss-animate`
- **Form Management:** Formik & Yup
- **API Client:** Axios
- **Icons:** [Lucide React](https://lucide.dev/)
- **Components:** Custom UI components styled with [Class Variance Authority (cva)](https://cva.style/docs) and `clsx`

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd legal-scale-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   - Copy the `.env.example` (or create a `.env` file based on your environment) and set the relevant backend API URLs and keys.
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
├── app/
│   ├── (ui)/           # Role-based protected routes (admin, manager, officer, supervisor, user)
│   ├── auth/           # Authentication pages (login, register)
│   ├── layout.tsx      # Root layout & providers
│   └── page.tsx        # Public landing page
├── _components/        # Reusable UI components
│   ├── common/         # Shared components across roles (nav, stats, loaders, theme)
│   └── landing/        # Landing page specific components (features, hero, etc.)
├── context/            # Global React contexts (e.g., AuthContext)
├── lib/                # Utility functions, axios API config, logic helpers
├── public/             # Static assets (images, icons)
```

## 📖 Documentation

For an in-depth guide on the application's architecture, API endpoints, role permissions, and development guidelines, please refer to the [DOCUMENTATION.md](./DOCUMENTATION.md) file.
