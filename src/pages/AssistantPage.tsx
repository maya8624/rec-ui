import { AssistantLayout } from '../components/assistant/AssistantLayout';

/**
 * Standalone full-screen page — intentionally outside MainLayout so it
 * doesn't inherit the Header or the floating chatbot button.
 */
export default function AssistantPage() {
  return <AssistantLayout />;
}
