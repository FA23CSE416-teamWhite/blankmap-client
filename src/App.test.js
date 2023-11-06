import { render, screen } from '@testing-library/react';
import App from './App';

test('app renders', () => {
  render(<App />);
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
// test('renders a header', () => {
//   const { getByText } = render(<App />);
//   const headerElement = getByText(/Welcome to My Barebones Website/i);
//   expect(headerElement).toBeInTheDocument();
// });

// test('renders a footer', () => {
//   const { getByText } = render(<App />);
//   const footerElement = getByText(/© 2023 My Barebones Website/i);
//   expect(footerElement).toBeInTheDocument();
// });