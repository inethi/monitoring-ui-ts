# monitoring-ui-ts

Locally hosted monitoring UI in Typescript

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   - Copy the `.example` file to `.env.local`:
     ```bash
     cp monitoring-ui/.example monitoring-ui/.env.local
     ```
   - Edit `monitoring-ui/.env.local` as needed:
     - Set `NEXT_PUBLIC_BACKEND=true` to use the backend API.
     - Set `NEXT_PUBLIC_BACKEND=false` to use local mock data from the `_data` folder.

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Switching Between Backend and Local Data

- **Backend:**
  - Set `NEXT_PUBLIC_BACKEND=true` in your `.env.local` file.
  - The app will fetch device data from the backend API.
- **Local Data:**
  - Set `NEXT_PUBLIC_BACKEND=false` in your `.env.local` file.
  - The app will use mock device data from `monitoring-ui/_data/*.json`.

## Notes

- You may need to restart the dev server after changing environment variables.
