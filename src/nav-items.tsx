
import React from 'react';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';

export const navItems = [
  {
    to: '/',
    page: <Index />,
  },
  {
    to: '/dashboard',
    page: <Dashboard />,
  },
];
