# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/07aa9ba7-b010-4149-bf0a-8b79d9e5b842

## Supabase Integration

This project uses Supabase for database functionality. For detailed setup instructions, see the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) file.

⚠️ **Important**: The original Supabase project URL in this repository cannot be resolved. See [SUPABASE_CONNECTION_FIX.md](./SUPABASE_CONNECTION_FIX.md) for solutions.

### Quick Setup

To properly set up the environment variables for Supabase:

**Windows Users:**
1. Run the setup script: `.\setup-env.ps1` (PowerShell) or `setup-env.bat` (Command Prompt)
2. This will set the required environment variables and start the development server

**Manual Setup:**
1. Create a `.env.local` file in the project root
2. Add the following variables with your own Supabase project details:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Fixing Browserslist Database Issues

If you encounter errors with the browserslist database (particularly with Bun), run:

```
npm run update-browserslist
```

This will update the caniuse-lite database using npm instead of Bun.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/07aa9ba7-b010-4149-bf0a-8b79d9e5b842) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/07aa9ba7-b010-4149-bf0a-8b79d9e5b842) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
