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

  it('highlights the current step', () => {
    render(
      <BrowserRouter>
        <Navigation currentStep={4} onStepChange={() => {}} />
      </BrowserRouter>
    );

    const activeStep = screen.getByRole('button', { name: /Comparação/i });
    const inactiveStep = screen.getByRole('button', { name: /Simulação/i });
    expect(activeStep).toHaveClass('bg-gradient-primary');
    expect(inactiveStep).not.toHaveClass('bg-gradient-primary');
  });
});
