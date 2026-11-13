# Frontend Documentation

## Overview

The frontend is the responsive browser application for **Note & Activity Tracker**. It is built with React and JavaScript (not TypeScript), uses React Router for page navigation, and communicates with the Express API using JSON over HTTP.

## Technology

- React 18 and React DOM
- JavaScript ES modules
- Vite and the React Vite plugin
- Tailwind CSS 4 through the Vite plugin
- React Router
- Tiptap rich-text editing
- Lucide React icons

## Requirements

- Node.js 18 or newer
- npm
- The backend API and MongoDB for authenticated, data-backed functionality

## Installation and local development

From the project root:

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`). In development, Vite proxies requests beginning with `/api` to `http://127.0.0.1:5000`; start the backend separately.

Create a production build:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

The deployable static output is written to `frontend/dist`.

## Environment configuration

The frontend supports one API base variable:

| Variable | Development default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `/api` | API base URL used by frontend requests. |

Local development uses `/api`, which the Vite dev server proxies to `http://127.0.0.1:5000`. Production builds use the checked-in `.env.production` value:

```dotenv
VITE_API_URL=https://care-guide-note-task-back-end.vercel.app/api
```

To use a different backend, set `VITE_API_URL` in the hosting provider's build environment; provider environment variables override `.env.production`. Include the `/api` prefix. The client removes a trailing slash before appending endpoint paths. Vite-exposed environment variables are included in browser code; never place credentials or private secrets in them.

## Admin login credentials (testing)

Use these credentials on the sign-in page when the backend has been configured with the matching test administrator:

- Email: `admin@example.com`
- Password: `Admin@12345`

These are demo credentials only. Do not use them for a production administrator; change or remove them before production deployment.

## Application routes

| Route | Screen | Access |
| --- | --- | --- |
| `/login` | Sign in | Public |
| `/signup` | Create an account | Public |
| `/overview` | Personal dashboard and recent activity | Signed in |
| `/notes` | Search, browse, edit, delete, and paginate private notes | Signed in |
| `/notes/new` | Create a note on a dedicated page | Signed in |
| `/notes/:noteId/edit` | Edit a note on a dedicated page | Signed in |
| `/community` | Browse public posts and create a post | Signed in for app access |
| `/interests` | Browse users grouped by interests | Signed in |
| `/admin` | Manage users and inspect all notes | Admin |

Unknown routes redirect to the appropriate signed-in overview or login page. The authenticated app shares a responsive sidebar/navigation and header. Note editing is separated from the notes list rather than presented in a modal.

## Features

- Centered sign-in and registration forms.
- JWT-backed session restoration and sign-out.
- Responsive overview, notes, community, interests, and admin pages.
- Paginated notes and community lists, plus admin lists.
- Note search across title and rich-text content.
- Tiptap formatting for bold, italic, strikethrough, headings, and ordered or bulleted lists.
- Image and document attachments embedded in rich-text content.
- Accessible labels, keyboard focus treatment, and reduced-motion support.
- User-visible loading, empty, API error, and success states.

### Rich-text attachments

The editor accepts PNG, JPEG, GIF, and WebP images, plus PDF, Word, Excel, CSV, and plain-text files. Each file is limited to 4 MB and the combined raw attachment data to 6 MB. Attachments are embedded in the saved HTML content, so they contribute to the document size; the MongoDB per-document size limit still applies.

## Project structure

```text
frontend/
├── index.html             # HTML shell, document title, favicon
├── public/                # Static public assets, including favicon.svg
├── src/
│   ├── App.jsx             # Authentication state and route definitions
│   ├── api.js              # API base URL, fetch helper, and small utilities
│   ├── components/         # Shared layout, editor, navigation, and UI
│   ├── pages/              # Route-level screens
│   ├── styles.css          # Tailwind import, theme, and global base styles
│   └── tw.js               # Helper for conditional Tailwind utility groups
├── vite.config.js          # React/Tailwind plugins and local API proxy
└── package.json
```

## API and session behavior

The shared API helper sends JSON request bodies with `Content-Type: application/json`, attaches the saved JWT as `Authorization: Bearer ...`, and displays API error messages to the user. It defaults to `/api` unless `VITE_API_URL` is configured.

After sign-in or registration, the token is stored in browser `localStorage` and sent with authenticated requests. On app startup the frontend validates the session with `GET /auth/me`; an invalid session is cleared and the user is returned to the login flow.

The backend API contract, endpoint access levels, and environment setup are documented in the backend repository's `README.md`.

## Deployment

For Netlify, Vercel, or another static host:

1. Select the repository and set the project/root directory to `frontend`.
2. Set the build command to `npm run build`.
3. Set the publish/output directory to `dist`.
4. The checked-in `.env.production` points to `https://care-guide-note-task-back-end.vercel.app/api`. If using another backend, set `VITE_API_URL` in the hosting provider's build environment, including the `/api` suffix.
5. The repository includes Vercel and Netlify SPA fallback configuration. Keep the frontend project root set to `frontend` and redeploy after pulling these files so React Router routes such as `/notes/new` work when opened directly.
6. Ensure the backend allows requests from the deployed site origin and serves HTTPS.

The frontend build is static; it does not run the API or contain the database. Keep API secrets and database credentials exclusively in the backend deployment environment.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| “Can’t reach the API” | Confirm the backend is running and connected to MongoDB; verify the Vite `/api` proxy or deployed `VITE_API_URL`. A successful backend health URL does not by itself confirm database-backed routes are healthy. |
| Login is rejected | Confirm the account exists, the password is correct, and the frontend is pointed at the intended backend. |
| Refreshing a nested route returns 404 | Confirm the frontend deployment includes `vercel.json` (Vercel) or the generated `dist/_redirects` file (Netlify), then redeploy. |
| CORS error in a deployed browser | Add the frontend origin to the backend's production CORS allow-list. |
| Attachments fail to save | Check the per-file and combined attachment limits, the API's 12 MB JSON limit, and MongoDB's document-size limit. |
