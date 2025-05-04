# Cortex AI - AI-Powered Code Generation Platform

Cortex AI is a powerful web application that leverages artificial intelligence to help developers generate code, build applications, and solve programming challenges. With an intuitive chat interface and file upload capabilities, Cortex AI makes it easy to collaborate with AI on your development projects.

## Features

- **AI Chat Interface**: Communicate with an AI assistant trained to help with coding tasks
- **Code Generation**: Generate production-ready code based on your requirements
- **File Upload**: Upload files and images to provide context for your requests
- **Code Highlighting**: View generated code with syntax highlighting
- **Chat History**: Access your previous conversations and generated code
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Google Authentication**: Secure login with your Google account

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Convex (database and file storage)
- **Authentication**: Clerk
- **AI**: Google Gemini API
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Convex account
- Clerk account
- Google AI API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_convex_deployment
GOOGLE_AI_API_KEY=your_google_ai_api_key
NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID=your_google_auth_client_id
\`\`\`

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/cortex-ai.git
   cd cortex-ai
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Convex Setup

1. Initialize Convex:
   \`\`\`bash
   npx convex init
   \`\`\`

2. Push the schema to Convex:
   \`\`\`bash
   npx convex push
   \`\`\`

## Project Structure

\`\`\`
cortex-ai/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components
│   ├── dashboard-*.tsx   # Dashboard components
│   └── file-*.tsx        # File handling components
├── context/              # React context providers
├── convex/               # Convex backend
│   ├── _generated/       # Generated Convex files
│   ├── chats.ts          # Chat operations
│   ├── files.ts          # File operations
│   ├── messages.ts       # Message operations
│   ├── schema.ts         # Database schema
│   └── users.ts          # User operations
├── lib/                  # Utility functions
├── public/               # Static assets
├── .env.local            # Environment variables
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
\`\`\`

## Deployment

The application can be deployed on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Convex](https://www.convex.dev/)
- [Clerk](https://clerk.dev/)
- [Google AI](https://ai.google.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
\`\`\`

Let's clean up the code by removing any unused files or code. Since we're using the new responsive sidebar, we can remove the old fixed sidebar implementation:
