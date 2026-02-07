import type { RouteObject } from 'react-router-dom';
import { AppLayout, ProtectedRoute } from 'presentation/components';
import { HomePage, RewardsPage, AdminPage } from 'presentation/pages';

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        )
      },
      {
        path: '/rewards',
        element: (
          <ProtectedRoute>
            <RewardsPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        )
      }
    ]
  }
];
