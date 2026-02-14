import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './components/auth/AuthGate';
import AppShell from './components/layout/AppShell';
import LandingPage from './pages/LandingPage';
import GeneratePage from './pages/GeneratePage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import ProposalDetailPage from './pages/ProposalDetailPage';

// Layout component for authenticated routes
function AuthenticatedLayout() {
  return (
    <AuthGate>
      <AppShell>
        <Outlet />
      </AppShell>
    </AuthGate>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Outlet />
      <Toaster />
    </ThemeProvider>
  ),
});

// Landing route (public)
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// Authenticated routes layout
const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: AuthenticatedLayout,
});

// Generate route
const generateRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/generate',
  component: GeneratePage,
});

// Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/dashboard',
  component: DashboardPage,
});

// Proposal detail route
const proposalDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/proposal/$proposalId',
  component: ProposalDetailPage,
});

// Account route
const accountRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/account',
  component: AccountPage,
});

// Create router
const routeTree = rootRoute.addChildren([
  landingRoute,
  authenticatedRoute.addChildren([
    generateRoute,
    dashboardRoute,
    proposalDetailRoute,
    accountRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
