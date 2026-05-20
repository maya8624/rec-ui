import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SuburbSummaryMessage } from './SuburbSummaryMessage';
import type { SuburbSummaryResponse } from '../../../types/copilot';

const mockData: SuburbSummaryResponse = {
  suburbs: [
    {
      name: 'Bondi Beach',
      description: 'A vibrant beach suburb.',
      rents: { oneBedroom: '$500/wk', twoBedroom: '$800/wk', threeBedroom: '$1,200/wk' },
      vacancyRate: '3.1%',
      trend: 'up 1.5% QoQ',
    },
    {
      name: 'Surry Hills',
      description: 'A trendy inner-city suburb.',
      rents: { oneBedroom: '$600/wk', twoBedroom: null, threeBedroom: null },
      vacancyRate: null,
      trend: null,
    },
  ],
};

describe('SuburbSummaryMessage', () => {
  it('renders all suburb names', () => {
    render(<SuburbSummaryMessage data={mockData} />);

    expect(screen.getByText('Bondi Beach')).toBeInTheDocument();
    expect(screen.getByText('Surry Hills')).toBeInTheDocument();
  });

  it('renders suburb descriptions', () => {
    render(<SuburbSummaryMessage data={mockData} />);

    expect(screen.getByText('A vibrant beach suburb.')).toBeInTheDocument();
    expect(screen.getByText('A trendy inner-city suburb.')).toBeInTheDocument();
  });

  it('renders rent values that are present', () => {
    render(<SuburbSummaryMessage data={mockData} />);

    expect(screen.getByText('1 bedroom: $500/wk')).toBeInTheDocument();
    expect(screen.getByText('2 bedroom: $800/wk')).toBeInTheDocument();
    expect(screen.getByText('3 bedroom: $1,200/wk')).toBeInTheDocument();
    expect(screen.getByText('1 bedroom: $600/wk')).toBeInTheDocument();
  });

  it('renders vacancy rate and trend when present', () => {
    render(<SuburbSummaryMessage data={mockData} />);

    expect(screen.getByText('Vacancy rate: 3.1%')).toBeInTheDocument();
    expect(screen.getByText('Trend: up 1.5% QoQ')).toBeInTheDocument();
  });

  it('does not render null rent fields', () => {
    render(<SuburbSummaryMessage data={mockData} />);

    const twoBedroomItems = screen.getAllByText(/2 bedroom/);
    expect(twoBedroomItems).toHaveLength(1);

    const threeBedroomItems = screen.queryAllByText(/3 bedroom/);
    expect(threeBedroomItems).toHaveLength(1);
  });

  it('does not render vacancy rate or trend when null', () => {
    render(<SuburbSummaryMessage data={mockData} />);

    const vacancyItems = screen.getAllByText(/Vacancy rate/);
    expect(vacancyItems).toHaveLength(1);

    expect(screen.queryAllByText(/Trend:/)).toHaveLength(1);
  });

  it('renders a fallback message when suburbs array is empty', () => {
    render(<SuburbSummaryMessage data={{ suburbs: [] }} />);

    expect(screen.getByText('No suburb data available.')).toBeInTheDocument();
  });
});
