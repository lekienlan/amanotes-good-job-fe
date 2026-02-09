import type { RouteObject } from 'react-router-dom';
import { AppLayout } from 'presentation/components';
import { HomePage, LoginPage, RewardsPage, AdminPage } from 'presentation/pages';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/rewards', element: <RewardsPage /> },
      { path: '/admin', element: <AdminPage /> }
    ]
  }
];
