
# VEAB Goa - Environmental Conservation Website

This project is the official website for Vivekanand Environment Awareness Brigade (VEAB) Goa, a non-profit organization dedicated to environmental education and wildlife conservation in Keri, Sattari, Goa. The website aims to provide information about VEAB's mission, projects, events, news, and ways to get involved.

## Tech Stack

This application is built with:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Generative AI (Optional, for future use):** [Genkit (by Google)](https://firebase.google.com/docs/genkit)
*   **Backend/Database:** [Firebase](https://firebase.google.com/) (Firestore for data storage)
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

The application requires Firebase credentials to connect to Firestore for dynamic content (news, events, contact form submissions) and potentially for other services. It also uses an environment variable for the `basePath` in certain contexts.

*   Copy the example environment file:
    ```bash
    cp src/.env.local.example src/.env.local
    ```
*   Open `src/.env.local` and replace the placeholder values with your **actual Firebase project credentials**. You can find these in your Firebase project settings.
    For local development, you typically **do not** need to set `NEXT_PUBLIC_BASE_PATH` unless you are specifically testing production-like `basePath` behavior. `next.config.ts` handles `basePath` for local development automatically (setting it to `''`). If you *do* set it for local testing, make sure it matches your intended production `basePath` (e.g., `/your-repo-name`).

    ```ini
    # Firebase Configuration - Replace with your actual project details
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY_FROM_ENV_LOCAL"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN_FROM_ENV_LOCAL"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID_FROM_ENV_LOCAL"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET_FROM_ENV_LOCAL"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID_FROM_ENV_LOCAL"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID_FROM_ENV_LOCAL"
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID_FROM_ENV_LOCAL" # Optional

    # Base Path for assets if needed during local development to simulate production
    # Typically, leave this commented out or empty for standard local development.
    # It's primarily used by the GitHub Actions workflow for production builds.
    # NEXT_PUBLIC_BASE_PATH=""
    ```

    **Note:** `src/.env.local` is gitignored and should never be committed to the repository.

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Firebase Setup

*   **Enable Firestore:** In your Firebase project, enable Firestore Database.
*   **Collections:** Create the following collections:
    *   `articles`: For news and blog posts. (See `src/types/index.ts` for `Article` structure)
    *   `events`: For upcoming events. (See `src/types/index.ts` for `Event` structure)
    *   `contactMessages`: For storing messages from the contact form.
*   **Security Rules:** Configure Firestore security rules. A basic starting point for development (allowing public reads for articles/events and creates for contact messages) is:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /articles/{articleId} {
          allow read: if true;
          allow write: if false; // Change for admin system
        }
        match /events/{eventId} {
          allow read: if true;
          allow write: if false; // Change for admin system
        }
        match /contactMessages/{messageId} {
          allow create: if true;
          allow read, update, delete: if false; // Change for admin system
        }
      }
    }
    ```
    **Important:** Secure these rules properly before going to production.

### 5. Running the Development Server

To run the Next.js development server (usually on `http://localhost:9002`):

```bash
npm run dev
# or
yarn dev
```

The application will reload automatically when you make changes.

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

*   **Repository Name:** Ensure `basePath` and `assetPrefix` in `next.config.ts`, and `NEXT_PUBLIC_BASE_PATH` in `.github/workflows/deploy.yml` are correctly set to your GitHub repository name (e.g., `/your-repo-name`). If your repository is named `VEABGoa`, these should be `/VEABGoa` or `/VEABGoa/` as appropriate.
*   **GitHub Secrets:** Configure the Firebase environment variables (from `src/.env.local.example`, **excluding** `NEXT_PUBLIC_BASE_PATH` which is set directly in the workflow) as GitHub Secrets in your repository settings (Settings > Secrets and variables > Actions). The workflow uses these secrets during the build process. The `NEXT_PUBLIC_BASE_PATH` is set directly in the workflow file.
*   **Limitations:**
    *   Server Actions (used for the contact form and admin article submission) **will not work** on GitHub Pages. The site will simulate success for these forms but no data will be saved to Firestore.
    *   News and events will be static content generated at build time.

### Other Hosting (e.g., Vercel, Netlify, Firebase Hosting)

For full functionality, including Server Actions, deploy to a platform that supports Next.js Node.js runtime.
*   You'll need to configure environment variables on your chosen hosting platform.
*   `next.config.ts` may need adjustments (e.g., removing `output: 'export'`, `basePath`, `assetPrefix` if not needed for the hosting provider).

## Admin Interface

A basic admin interface is available at `/admin/add-article` to add new news articles.
*   **Security:** This interface is currently **not secured**. Anyone with the URL can access it. Implementing proper authentication and authorization is a critical next step for any production use.
*   **Functionality on GitHub Pages:** The admin interface will be present on the static site, but the "Publish Article" button will be disabled as server actions do not work.

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
