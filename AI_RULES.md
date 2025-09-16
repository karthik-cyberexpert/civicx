# AI Development Rules for Civix App

This document provides guidelines for AI developers working on this project. Adhering to these rules ensures consistency, maintainability, and quality.

## Tech Stack Overview

The application is built with a modern, mobile-first approach using the following technologies:

*   **Framework:** React v18 with Create React App.
*   **Language:** TypeScript for type safety and improved developer experience.
*   **Routing:** React Router (`react-router-dom`) for handling authentication-related routes (`/login`, `/signup`) and protecting the main application.
*   **Internal Navigation:** The main app uses a state-based navigation system managed in `App.tsx` to switch between different screens (Home, Reports, Profile, etc.).
*   **Styling:** A custom, mobile-first CSS architecture defined primarily in `src/App.css`. The design is fully responsive and tailored for this application.
*   **Component Library:** A set of custom-built UI components located in `src/components/` (e.g., `Button.tsx`, `Input.tsx`).
*   **Icons:** `lucide-react` is the exclusive icon library for all vector icons.
*   **State Management:** React Context API for global state (e.g., `AuthContext`) and React Hooks (`useState`, `useEffect`) for local component state.
*   **Location Services:** A custom `LocationService` in `src/utils/locationUtils.ts` that utilizes the Browser Geolocation API and the Google Maps API for high-accuracy GPS data.

## Library and Pattern Usage Rules

To maintain a clean and consistent codebase, follow these specific rules:

1.  **UI Components:**
    *   **DO** use the existing custom components from `src/components/` (e.g., `Input`, `Button`) whenever possible.
    *   **DO** extend existing components or create new custom components if new functionality is needed. Follow the established design patterns and CSS conventions.
    *   **DO NOT** introduce third-party component libraries like Material-UI, Ant Design, or shadcn/ui.

2.  **Styling:**
    *   **DO** write all new styles in the existing `src/App.css` file.
    *   **DO** follow the mobile-first, responsive design principles already in place.
    *   **DO NOT** add any new styling libraries (e.g., Tailwind CSS, styled-components, Emotion). All styling must be done with plain CSS.

3.  **Routing & Navigation:**
    *   **DO** use `react-router-dom` for top-level routing between the login/signup pages and the main authenticated app, as configured in `AppWrapper.tsx`.
    *   **DO** use the state-based navigation system (`currentScreen` state in `App.tsx`) for switching between views *within* the main application.
    *   **DO NOT** add new routes to `AppWrapper.tsx` for internal app screens. Add new screens to the `Screen` type and the `renderScreen` function in `App.tsx`.

4.  **State Management:**
    *   **DO** use the `AuthContext` for any global authentication state.
    *   **DO** create new Context providers for other global state needs if necessary.
    *   **DO** use `useState`, `useRef`, and `useEffect` for all component-level state.
    *   **DO NOT** introduce state management libraries like Redux, Zustand, or MobX.

5.  **Icons:**
    *   **DO** use icons exclusively from the `lucide-react` package.
    *   **DO NOT** install any other icon libraries or use SVGs directly unless absolutely necessary.

6.  **Forms & Validation:**
    *   **DO** build all forms using the custom `Input` and `Button` components.
    *   **DO** create validation logic in separate utility files (e.g., `src/utils/passwordValidation.ts`) for reusability and separation of concerns.

7.  **Location Services:**
    *   **DO** use the singleton `LocationService` from `src/utils/locationUtils.ts` for all GPS and location-related tasks.
    *   **DO NOT** interact with `navigator.geolocation` or the Google Maps API directly in components.

8.  **Dependencies:**
    *   **DO NOT** add new third-party dependencies unless there is a compelling reason and it has been approved. Prioritize using existing libraries and native browser APIs.