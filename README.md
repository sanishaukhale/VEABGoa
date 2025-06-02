
# VEAB Goa - Environmental Conservation Website

This project is the official website for Vivekanand Environment Awareness Brigade (VEAB) Goa, a non-profit organization dedicated to environmental education and wildlife conservation in Keri, Sattari, Goa. The website aims to provide information about VEAB's mission, projects, events, news, and ways to get involved.

## Tech Stack

This application is built with:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Generative AI (Optional, for future use):** [Genkit (by Google)](https://firebase.google.com/docs/genkit)
*   **Backend/Database:** [Firebase](https://firebase.google.com/) (Firestore for data storage, Firebase Authentication for admin users)
*   **Version Control:** Git
*   **Deployment (Static Version):** GitHub Pages via GitHub Actions

## Prerequisites

*   [Node.js](https://nodejs.org/) (v20.x or later recommended)
*   [npm](https://www.npmjs.com/) (v9.x or later) or [yarn](https://yarnpkg.com/) (v1.22.x or later)
*   A Firebase project.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git # Replace with your actual repo URL
cd your-repo-name
```

### 2. Set Up Environment Variables

The application requires Firebase credentials to connect to Firestore and Firebase Authentication. It also uses an environment variable for the `basePath` in certain contexts.

*   **IMPORTANT:** Environment variables are managed in a `.env.local` file located in the **root of your project directory**.
*   Copy the example environment file:
    ```bash
    cp .env.local.example .env.local
    ```
*   Open `.env.local` (in the project root) and replace the placeholder values with your **actual Firebase project credentials**. You can find these in your Firebase project settings.
    For local development, you typically **do not** need to set `NEXT_PUBLIC_BASE_PATH` unless you are specifically testing production-like `basePath` behavior. `next.config.ts` handles `basePath` for local development automatically (setting it to `''`). If you *do* set it for local testing, make sure it matches your intended production `basePath` (e.g., `/your-repo-name`).

    Your `.env.local` file should look like this (replace placeholders):
    ```ini
    # Firebase Configuration - Replace with your actual project details
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY_FROM_FIREBASE"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN_FROM_FIREBASE"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID_FROM_FIREBASE"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET_FROM_FIREBASE"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID_FROM_FIREBASE"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID_FROM_FIREBASE"
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID_FROM_FIREBASE" # Optional

    # Base Path for assets if needed during local development to simulate production
    # Typically, leave this commented out or empty for standard local development.
    # It's primarily used by the GitHub Actions workflow for production builds.
    # NEXT_PUBLIC_BASE_PATH=""
    ```

    **Note:** `.env.local` is gitignored and should never be committed to the repository.
    **VERY IMPORTANT:** After creating or modifying `.env.local`, you **MUST RESTART** your Next.js development server (e.g., stop and re-run `npm run dev` or `yarn dev`) for the changes to take effect. Next.js only loads environment variables on server start.

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Firebase Setup

*   **Enable Firestore:** In your Firebase project, enable Firestore Database.
*   **Enable Firebase Authentication:**
    *   Go to the "Authentication" section in your Firebase console.
    *   Click on the "Sign-in method" tab.
    *   Enable the "Email/Password" provider (or any other provider you intend to use for admin access).
    *   Create at least one admin user manually in the "Users" tab of the Authentication section. You will use these credentials to log into the admin panel.
*   **Firestore Collections:** Create the following collections:
    *   `articles`: For news and blog posts. (See `src/types/index.ts` for `Article` structure)
    *   `events`: For upcoming events. (See `src/types/index.ts` for `Event` structure)
    *   `projects`: For conservation projects. (See `src/types/index.ts` for `Project` structure)
    *   `contactMessages`: For storing messages from the contact form.
*   **Firestore Security Rules:** Configure Firestore security rules. A starting point allowing public reads for content, creates for contact messages, and writes to articles/projects only for authenticated users:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /articles/{articleId} {
          allow read: if true;
          allow write: if request.auth != null; // Only authenticated users can write
        }
        match /events/{eventId} {
          allow read: if true;
          // allow write: if request.auth != null; // Uncomment if events are admin-managed
        }
        match /projects/{projectId} {
          allow read: if true;
          allow write: if request.auth != null; // Only authenticated users can write
        }
        match /contactMessages/{messageId} {
          allow create: if true;
          allow read, update, delete: if request.auth != null; // Admins can read messages
        }
        // Add rules for other collections as needed
      }
    }
    ```
    **Important:** Secure these rules properly for production. For example, you might want to restrict write access to specific admin UIDs rather than any authenticated user.

### 5. Running the Development Server

To run the Next.js development server (usually on `http://localhost:9002`):

```bash
npm run dev
# or
yarn dev
```

The application will reload automatically when you make changes to most code files. However, **if you change `.env.local`, you must restart the server.**

### 6. Running the Genkit Development Server (If using Genkit features)

If you are implementing Genkit flows for AI features:

```bash
npm run genkit:dev
# or for watching changes:
npm run genkit:watch
```
This typically runs on `http://localhost:3100`.

## Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
```
This command generates static HTML/CSS/JS files in the `out` directory, suitable for static hosting.

## Deployment

### GitHub Pages (Static Deployment)

This project is configured for deployment to GitHub Pages via a GitHub Actions workflow (`.github/workflows/deploy.yml`).

*   **Repository Name:** Ensure `basePath` in `next.config.ts`, and `NEXT_PUBLIC_BASE_PATH` in `.github/workflows/deploy.yml` are correctly set to your GitHub repository name (e.g., `/your-repo-name`). If your repository is named `VEABGoa`, these should be `/VEABGoa`.
*   **GitHub Secrets:** Configure the Firebase environment variables (matching those in `.env.local.example`, **excluding** `NEXT_PUBLIC_BASE_PATH` which is set directly in the workflow) as GitHub Secrets in your repository settings (Settings > Secrets and variables > Actions). The workflow uses these secrets during the build process. The `NEXT_PUBLIC_BASE_PATH` is set directly in the workflow file.
*   **Limitations:**
    *   Firebase Authentication will work client-side (users can log in).
    *   The contact form, admin article submission, and admin project submission will attempt client-side writes to Firestore. These rely on Firestore security rules and client-side Firebase initialization. If Firebase is not correctly configured with valid credentials accessible to the client build, these operations may fail silently or show simulated success.
    *   News, events, and projects will be static content generated at build time (unless fetched client-side, which is the current setup for the "Coming Soon" pages).

### Other Hosting (e.g., Vercel, Netlify, Firebase Hosting)

For full functionality, including robust backend database interactions if client-side writes are not desired, deploy to a platform that supports Next.js Node.js runtime.
*   You'll need to configure environment variables on your chosen hosting platform.
*   `next.config.ts` may need adjustments (e.g., removing `output: 'export'`, `basePath` if not needed for the hosting provider).

## Admin Interface

Admin interfaces are available at:
*   `/admin/login`: To log in to the admin panel.
*   `/admin/add-article`: To add new news articles (requires login).
*   `/admin/add-project`: To add new projects (requires login).
*   **Functionality on GitHub Pages:** Admin users can log in. The "Publish" buttons on admin forms will be enabled after login and will attempt client-side database writes.

## Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

---

This `README.md` will be updated as the project evolves.
