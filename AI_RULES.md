# AI Development Rules for Africage

This document outlines the technical stack and development conventions for the Africage web application. Following these rules ensures consistency, maintainability, and quality in our codebase.

## Tech Stack

Our application is built with a modern, robust technology stack:

*   **Frontend**: The user interface is built with **React** and **TypeScript**, powered by the **Vite** build tool for a fast development experience.
*   **Backend-as-a-Service**: We use **Supabase** for core backend functionalities, including user authentication, database interactions (PostgreSQL), and serverless Edge Functions.
*   **Styling**: All styling is done using **Tailwind CSS**. We do not use plain CSS files or other styling libraries.
*   **UI Components**: We leverage **shadcn/ui** for a comprehensive set of pre-built, accessible, and customizable components.
*   **Routing**: Client-side navigation is handled by **React Router**.
*   **Icons**: All icons are provided by the **Lucide React** library for consistency and performance.
*   **Payments**: Payment processing is managed by **Stripe**, integrated securely through Supabase Edge Functions.
*   **API**: A dedicated **Node.js/Express** API with **Prisma ORM** exists in the `apps/api` directory to handle complex business logic.

## Library and Convention Rules

To maintain a clean and predictable codebase, please adhere to the following rules:

### 1. UI and Components

*   **Primary Component Library**: **ALWAYS** use components from the **shadcn/ui** library whenever possible. These components are pre-installed and should be the first choice for building UI.
*   **Custom Components**: If a required component is not available in shadcn/ui, create a new, reusable component inside the `src/components/ui/` directory. Follow the existing file structure and coding style.
*   **Styling**: Use **Tailwind CSS classes exclusively** for all styling. Do not write custom CSS in `.css` files. All styling logic should be co-located with the component markup.

### 2. State Management

*   **Local State**: For component-level state, use React's built-in hooks (`useState`, `useReducer`).
*   **Global State**: For global state (like user authentication), use React's Context API combined with custom hooks (e.g., `useAuth`). Avoid introducing complex state management libraries like Redux or Zustand unless the application's complexity absolutely requires it.

### 3. Data Fetching & Backend Interaction

*   **Supabase Client**: All interactions with the Supabase database and authentication must go through the pre-configured Supabase client instance located at `src/lib/supabase.ts`.
*   **Custom Hooks**: Encapsulate data fetching logic and state management related to backend data within custom hooks (e.g., `useAuth`, `useSubscription`). This promotes reusability and separation of concerns.

### 4. Routing

*   **Route Definitions**: All application routes must be defined and managed within `src/App.tsx` using the components provided by `react-router-dom`.
*   **Protected Routes**: Use the existing `ProtectedRoute` component in `src/components/auth/ProtectedRoute.tsx` to secure routes that require user authentication.

### 5. Icons

*   **Icon Library**: Only use icons from the `lucide-react` package. This ensures visual consistency and optimized performance. Do not use SVG files or other icon libraries directly.

### 6. Code Structure

*   **Pages**: Top-level page components should reside in `src/pages/`.
*   **Reusable Components**: General-purpose, reusable components should be placed in `src/components/`.
*   **Hooks**: Custom hooks should be placed in `src/hooks/`.
*   **File Naming**: Use PascalCase for component and page files (e.g., `HomePage.tsx`).