import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppWrapper from './AppWrapper';

test('renders home screen with navigation', () => {
  render(<AppWrapper />);
  // Check for home screen elements
  const civixElement = screen.getByText(/Civix/i);
  expect(civixElement).toBeInTheDocument();
  
  // Check for navigation elements
  const homeNavElement = screen.getByText(/Home/i);
  expect(homeNavElement).toBeInTheDocument();
});