/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import AppWrapper from './AppWrapper';

test('renders login screen for unauthenticated user', () => {
  render(<AppWrapper />);
  
  // By default, the user is not authenticated and should see the login screen.
  const loginTitle = screen.getByText(/Welcome Back/i);
  expect(loginTitle).toBeInTheDocument();
  
  // Check that elements from the main app are not present
  const homeScreenTitle = screen.queryByText(/Making your city better, together/i);
  expect(homeScreenTitle).not.toBeInTheDocument();
});