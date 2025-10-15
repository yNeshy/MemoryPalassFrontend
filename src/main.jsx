import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './Pages/home';
import MemoryPage from './Pages/memory';
import SettingsPage from './Pages/settings';
import Layout from './layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}


const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <SignedIn>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/memory" element={<MemoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* Fallback: redirect unknown routes to home */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Layout>
          </SignedIn>

          <SignedOut>
            <SignInButton />
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </BrowserRouter>
      </ClerkProvider>
    </QueryClientProvider>
  </StrictMode>,
)
