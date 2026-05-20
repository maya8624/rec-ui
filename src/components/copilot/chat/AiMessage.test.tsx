import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AiMessage } from './AiMessage';
import type { CopilotMessage, SuburbSummaryResponse } from '../../../types/copilot';

const suburbData: SuburbSummaryResponse = {
  suburbs: [
    {
      name: 'Bondi Beach',
      description: 'A vibrant beach suburb.',
      rents: { oneBedroom: '$500/wk', twoBedroom: null, threeBedroom: null },
      vacancyRate: '3.1%',
      trend: null,
    },
  ],
};

describe('AiMessage', () => {
  it('renders plain text for a standard message', () => {
    const msg: CopilotMessage = { id: '1', role: 'ai', text: 'Hello there' };
    render(<AiMessage message={msg} />);

    expect(screen.getByText('Hello there')).toBeInTheDocument();
  });

  it('shows the streaming cursor while streaming', () => {
    const msg: CopilotMessage = { id: '1', role: 'ai', text: 'Typing...', streaming: true };
    const { container } = render(<AiMessage message={msg} />);

    expect(container.querySelector('span[aria-hidden]')).toBeInTheDocument();
  });

  it('hides the streaming cursor when not streaming', () => {
    const msg: CopilotMessage = { id: '1', role: 'ai', text: 'Done' };
    const { container } = render(<AiMessage message={msg} />);

    expect(container.querySelector('span[aria-hidden]')).not.toBeInTheDocument();
  });

  it('renders SuburbSummaryMessage for type suburb-summary', () => {
    const msg: CopilotMessage = {
      id: '1',
      role: 'ai',
      text: '',
      type: 'suburb-summary',
      suburbSummary: suburbData,
    };
    render(<AiMessage message={msg} />);

    expect(screen.getByText('Bondi Beach')).toBeInTheDocument();
    expect(screen.getByText('A vibrant beach suburb.')).toBeInTheDocument();
  });

  it('does not render plain text for a suburb-summary message', () => {
    const msg: CopilotMessage = {
      id: '1',
      role: 'ai',
      text: 'should not appear',
      type: 'suburb-summary',
      suburbSummary: suburbData,
    };
    render(<AiMessage message={msg} />);

    expect(screen.queryByText('should not appear')).not.toBeInTheDocument();
  });

  it('renders the message text without a sender label', () => {
    const msg: CopilotMessage = { id: '1', role: 'ai', text: 'Hi' };
    render(<AiMessage message={msg} />);

    expect(screen.getByText('Hi')).toBeInTheDocument();
    expect(screen.queryByText('rec-brain')).not.toBeInTheDocument();
  });
});
