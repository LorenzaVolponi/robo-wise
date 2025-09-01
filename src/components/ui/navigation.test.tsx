import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './navigation';

describe('Navigation', () => {
  it('renders feature links', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /Comparar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Risco/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Docs/i })).toBeInTheDocument();
  });
});
