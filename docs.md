# Monitoring UI (TypeScript, Next.js)

A modern device and network management dashboard built with React, Next.js, shadcn/ui, and Sonner for toast notifications. This application provides robust forms, validation, and a consistent user experience for managing devices and networks.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Device & Network Management](#device--network-management)
- [Validation & UX](#validation--ux)
- [Toast & Dialog Handling](#toast--dialog-handling)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This dashboard allows users to add, edit, and delete devices and networks with real-time feedback, robust validation, and a clean, accessible UI. It is designed for reliability, extensibility, and a seamless user experience.

---

## Features

- **Device Management**: Add, edit, delete, and list devices with validation for IP and MAC addresses.
- **Network Management**: Create and manage networks with duplicate name protection.
- **Dialogs & Toasts**: Consistent dialogs for forms and Sonner-powered toasts for feedback.
- **Robust Validation**: Regex-based validation for device fields and user-friendly error messages.
- **Consistent UI**: Built with shadcn/ui for a modern, accessible interface.
- **Loading States**: Custom loading buttons and disabled actions during async operations.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **TypeScript**: Type safety throughout
- **Axios**: For API requests

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
cd monitoring-ui-ts/monitoring-ui
npm install
# or
yarn install
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
monitoring-ui-ts/
  docs.md                # This documentation
  monitoring-ui/
    src/
      app/               # Next.js app directory
      components/        # UI and feature components
      lib/               # API, context, and utility code
```

- **app/**: Next.js pages and layouts
- **components/**: Device, network, and UI components (dialogs, forms, buttons)
- **lib/**: API endpoints, authentication context, utilities

---

## Device & Network Management

### Devices

- **Add/Edit Device**: Dialogs with forms for name, IP, MAC, and type (dropdown).
- **Validation**: IP and MAC addresses validated with regex. Device type is a required dropdown.
- **List Refresh**: Device list auto-refreshes after add/edit/delete.
- **Delete Device**: Confirmation dialog with loading state and toast feedback.

### Networks

- **Create Network**: Form with name and description. Duplicate names are prevented.
- **Validation**: Required fields, error toasts for duplicates.

---

## Validation & UX

- **Regex Validation**: IP and MAC addresses are validated using regex patterns.
- **Dropdowns**: Device type selection uses a controlled dropdown (never `undefined`/`null`).
- **Loading States**: All async actions show loading indicators and disable relevant buttons.
- **Dialogs**: Managed at the page level; open/close state and handlers are passed as props.
- **Toasts**: Shown on both success and error, with Undo/Close actions. Errors never close dialogs automatically.

---

## Toast & Dialog Handling

- **Sonner `<Toaster />`**: Must be present at the app root (e.g., in `layout.tsx`).
- **Toast API**: Use Sonner’s API for toasts. Always show a toast for both success and error.
- **Dialog State**: Managed at the page (parent) level. Pass open/close handlers and loading state to dialogs/forms.
- **Portal Rendering**: Ensure dialogs render in a portal to avoid layout shifts.

---

## Best Practices

- **Controlled Inputs**: Always provide a value prop to inputs and dropdowns to avoid controlled/uncontrolled warnings.
- **Consistent UI**: Use shadcn/ui components for all forms, dialogs, and buttons.
- **Error Handling**: Show clear error messages in toasts and keep dialogs open on error.
- **Accessibility**: Use semantic HTML and accessible components.
- **Code Organization**: Keep API, context, and utilities in `lib/`. Keep UI in `components/`.

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run lint and tests
5. Commit and push (`git commit -m 'Add feature' && git push`)
6. Open a pull request

---

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Sonner Toast Documentation](https://sonner.emilkowal.ski/)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Markdown Guide](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
