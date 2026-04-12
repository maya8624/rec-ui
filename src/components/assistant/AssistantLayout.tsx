import { useAssistantChat } from '../../hooks/useAssistantChat';
import { Sidebar } from './Sidebar';
import { ConversationPanel } from './ConversationPanel';
import { RightPanel } from './RightPanel';

/**
 * Three-zone Claude-style layout:
 *   [Sidebar (hidden on mobile)] | [ConversationPanel] | [RightPanel (conditional)]
 *
 * State is owned entirely by useAssistantChat — this component is layout-only.
 */
export const AssistantLayout = () => {
  const {
    messages,
    isPending,
    error,
    rightPanelData,
    sendMessage,
    dismissRightPanel,
    startNewChat,
  } = useAssistantChat();

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Left sidebar — hidden below md breakpoint */}
      <div className="hidden md:flex">
        <Sidebar onNewChat={startNewChat} />
      </div>

      {/* Center conversation — always visible, takes remaining space */}
      <ConversationPanel
        messages={messages}
        isLoading={isPending}
        error={error}
        onSend={sendMessage}
      />

      {/* Right panel — only mounts when there's data; hidden below lg */}
      {rightPanelData && (
        <div className="hidden lg:flex">
          <RightPanel data={rightPanelData} onDismiss={dismissRightPanel} />
        </div>
      )}
    </div>
  );
};
