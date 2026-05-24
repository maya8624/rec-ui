import { useRef, useState } from "react";
import { useCopilotChat } from "../../hooks/useCopilotChat";
import { CopilotHeader } from "../../components/copilot/layout/CopilotHeader";
import { LeftColumn } from "../../components/copilot/layout/LeftColumn";
import { CopilotPanel } from "../../components/copilot/layout/CopilotPanel";
import { workflowSteps, suggestedSteps } from "../../data/copilot/demoData";
import { mockPreferencePayload } from "../../api/actionApi";
import type { ListingItem } from "../../types/copilot";

const FIND_PROPERTIES_MESSAGE =
  "Find me a 2 or 3 bedroom pet friendly property in Bondi Beach, Surry Hills under $950/wk available within 14 days";

export default function CopilotPage() {
  const {
    messages,
    isStreaming,
    handleAction: chatHandleAction,
    handleStreamFromApi,
  } = useCopilotChat();
  const [properties, setProperties] = useState<ListingItem[]>([]);
  const matchesSentRef = useRef(false);
  const suburbSummarySentRef = useRef(false);

  async function handleAction(label: string) {
    if (label === "Find matching properties") {
      if (matchesSentRef.current) return;
      matchesSentRef.current = true;
      await handleStreamFromApi(
        FIND_PROPERTIES_MESSAGE,
        {
          message: FIND_PROPERTIES_MESSAGE,
          propertyId: null,
          threadId: null,
          metadata: {
            intent: null,
            suburbs: mockPreferencePayload.suburbs,
            budgetMax: mockPreferencePayload.maxRent,
            petFriendly: mockPreferencePayload.petFriendly,
            bedroomsMin: mockPreferencePayload.minBeds,
            bedroomsMax: mockPreferencePayload.maxBeds,
            availableWithinDays: mockPreferencePayload.availableWithinDays,
          },
        },
        (listings) => setProperties(listings),
      );
      return;
    }
    if (label === "Suburb summary") {
      if (suburbSummarySentRef.current || isStreaming) return;
      suburbSummarySentRef.current = true;
      const suburbs = mockPreferencePayload.suburbs;
      const message = `Give me a suburb summary for ${suburbs.join(", ")}`;
      await handleStreamFromApi(
        message,
        {
          message,
          propertyId: null,
          threadId: null,
          metadata: { intent: "suburb_summary", suburbs },
        },
        () => {},
      );
      return;
    }
    chatHandleAction(label);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col p-4 gap-4">
        <CopilotHeader />
        <div className="flex flex-col md:flex-row items-start">
          <LeftColumn
            onAction={handleAction}
            disabled={isStreaming}
            steps={workflowSteps}
            suggestedSteps={suggestedSteps}
          />
          <CopilotPanel
            messages={messages}
            properties={properties}
            listingsError={false}
            onSend={(text) => handleStreamFromApi(text, { message: text, propertyId: null, threadId: null }, () => {})}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
