import App from './App';
import { render, screen } from '@testing-library/react';

describe('ensure vitest works properly', () => {
  it('should render App correctly', () => {
    render(<App />);
    expect(screen.getByText('hello world!')).toBeInTheDocument();
  });
});
