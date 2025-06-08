
# VEAB Goa - Environmental Conservation Website

This project is the official website for Vivekanand Environment Awareness Brigade (VEAB) Goa, a non-profit organization dedicated to environmental education and wildlife conservation in Keri, Sattari, Goa. The website aims to provide information about VEAB's mission, projects, events, news, and ways to get involved.

## Tech Stack

This application is built with:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Generative AI (Optional, for future use):** [Genkit (by Google)](https://firebase.google.com/docs/genkit)
*   **Backend/Database:** [Firebase](https://firebase.google.com/) (Firestore for data storage, Firebase Authentication for admin users, Firebase Storage for images)
*   **Version Control:** Git
*   **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Prerequisites

*   [Node.js](https://nodejs.org/) (v20.x or later recommended)
*   [npm](https://www.npmjs.com/) (v9.x or later) or [yarn](https://yarnpkg.com/) (v1.22.x or later)
*   A Firebase project.
*   [Firebase CLI](https://firebase.google.com/docs/cli) installed and configured.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git # Replace with your actual repo URL
cd your-repo-name
```

### 2. Set Up Environment Variables

The application requires Firebase credentials to connect to Firestore, Firebase Authentication, and Firebase Storage.

*   **IMPORTANT:** Environment variables are managed in a `.env.local` file located in the **root of your project directory**.
*   Copy the example environment file:
    ```bash
    cp .env.local.example .env.local
    ```
*   Open `.env.local` (in the project root) and replace the placeholder values with your **actual Firebase project credentials**. You can find these in your Firebase project settings.

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
    *   Enable the "Email/Password" provider.
    *   Create at least one admin user manually in the "Users" tab.
*   **Enable Firebase Storage:** In your Firebase project, enable Firebase Storage and set up security rules (see below).
*   **Firestore Collections:**
    *   Create: `articles`, `events`, `projects`, `contactMessages`.
    *   Create: `teamMembers`. For each document in `teamMembers`, use the following structure:
        *   `name` (String): e.g., "Chandrakant Shinde"
        *   `role` (String): e.g., "President"
        *   `imageUrl` (String): Path in Firebase Storage, e.g., "team-images/chandrakant_shinde.png"
        *   `dataAiHint` (String, optional): e.g., "person smiling"
        *   `intro` (String): A short introduction or bio.
        *   `profession` (String): e.g., "Environmental Leader"
        *   `socials` (Array of Objects): Each object should have:
            *   `platform` (String): "LinkedIn", "Twitter", or "Mail"
            *   `url` (String): Full URL to the social profile or mailto link.
        *   `displayOrder` (Number, optional): e.g., 1, 2, 3 for custom ordering on the page. If not used, ordering will be by name.
    *   You can use the `node scripts/populateTeamMembers.js` script to add initial dummy data to the `teamMembers` collection (see script comments for setup).
*   **Firebase Storage:** Create a folder (e.g., `team-images`) for member portraits if using Firebase Storage for those. Ensure the paths in the `imageUrl` field of your `teamMembers` documents match the actual paths in Storage.
*   **Security Rules:**
    *   **Firestore Rules:**
        ```javascript
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /articles/{articleId} { allow read: if true; allow write: if request.auth != null; }
            match /events/{eventId} { allow read: if true; /* allow write: if request.auth != null; */ }
            match /projects/{projectId} { allow read: if true; allow write: if request.auth != null; }
            match /contactMessages/{messageId} { allow create: if true; allow read, update, delete: if request.auth != null;}
            match /teamMembers/{memberId} { allow read: if true; allow write: if request.auth != null; } // Added rule for teamMembers
          }
        }
        ```
    *   **Firebase Storage Rules (Example):**
        ```
        rules_version = '2';
        service firebase.storage {
          match /b/{bucket}/o {
            // Allow public read access to images in the 'team-images' folder
            match /team-images/{allPaths=**} {
              allow read: if true;
              allow write: if request.auth != null; // Only allow authenticated users to upload/modify
            }
            // Add other rules as needed for other paths
          }
        }
        ```
    **Important:** Secure these rules properly for production.
*   **Firestore Indexes:**
    *   Firestore automatically creates single-field indexes. However, for more complex queries (e.g., ordering by multiple fields, or combining range filters with ordering), you'll need to create composite indexes.
    *   If you see an error in your browser console or Firebase logs mentioning "The query requires an index...", Firebase usually provides a direct link to create the missing index.
    *   For the `teamMembers` collection, if you sort by `displayOrder` (ascending) and then by `name` (ascending) (as done in the admin panel), you will need a composite index.
        *   **Collection ID:** `teamMembers`
        *   **Fields to index:**
            1.  `displayOrder` (Ascending)
            2.  `name` (Ascending)
    *   You can create this index in your Firebase Console under Firestore Database > Indexes.

### 5. Running the Development Server

```bash
npm run dev
# or
yarn dev
```
The app usually runs on `http://localhost:9002`. Restart if you change `.env.local`.

### 6. Running the Genkit Development Server (If using Genkit features)

```bash
npm run genkit:dev
# or for watching changes:
npm run genkit:watch
```
This typically runs on `http://localhost:3100`.

## Building for Production (Not for direct deployment to App Hosting)

While `npm run build` is part of the App Hosting process, you don't manually deploy the `out` or `.next` folder. App Hosting handles this.
```bash
npm run build
# or
yarn build
```

## Deployment to Firebase App Hosting

Firebase App Hosting builds your Next.js application using buildpacks and deploys it to a managed Cloud Run service.

1.  **Ensure Firebase CLI is updated and you're logged in:**
    ```bash
    npm install -g firebase-tools
    firebase login
    firebase use YOUR_PROJECT_ID
    ```
2.  **Deploy:**
    ```bash
    firebase deploy --only apphosting
    ```
    Or, if you have multiple App Hosting backends, specify the backend ID:
    ```bash
    firebase deploy --only apphosting:YOUR_BACKEND_ID
    ```
3.  **CI/CD (Optional but Recommended):**
    *   You can connect your GitHub repository directly to Firebase App Hosting in the Firebase console for automatic deployments on push to a branch.
    *   The GitHub Actions workflow for GitHub Pages deployment (`.github/workflows/deploy.yml`) has been disabled as Firebase App Hosting is the preferred deployment method.

**Environment Variables for Firebase App Hosting:**
*   App Hosting allows you to set environment variables directly in the Firebase Console (App Hosting > Your Backend > Settings/Configuration) or via the `apphosting.yaml` file for some configurations.
*   Secrets (like API keys) should be managed through Secret Manager and referenced in App Hosting.
*   `NEXT_PUBLIC_` prefixed variables from your `.env.local` will need to be set in the App Hosting environment for the build process and client-side use.

## Admin Interface

Admin interfaces are available at:
*   `/admin/login`: To log in to the admin panel.
*   `/admin/add-article`: To add new news articles (requires login).
*   `/admin/add-project`: To add new projects (requires login).
*   `/admin/manage-team`: To manage team member details (requires login).

## Contributing

Contributions are welcome! Please follow standard fork and pull request procedures.

---

This `README.md` will be updated as the project evolves.

