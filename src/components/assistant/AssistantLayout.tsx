import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faHouse, faMoon, faSun, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useLogout } from '../../hooks/useLogout';
import { useAssistantChatStream } from '../../hooks/useAssistantChatStream';
import { ConversationPanel } from './ConversationPanel';
import { RightPanel } from './RightPanel';
import { Sidebar } from './Sidebar';

export const AssistantLayout = () => {
  const { isDark, toggle } = useTheme();
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const username = user?.firstName ?? user?.email.split('@')[0];

  const {
    messages,
    isPending,
    toolStatus,
    error,
    rightPanelData,
    sendMessage,
    dismissRightPanel,
    startNewChat,
  } = useAssistantChatStream();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#1C1917] font-[Inter,sans-serif] text-[15px] leading-relaxed">
      {/* Mobile header — hidden on desktop where Sidebar takes over */}
      <header className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-[#0C0A09] text-white shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-white hover:text-zinc-300 no-underline transition-colors"
        >
          <FontAwesomeIcon icon={faHouse} className="text-sm" />
          <span className="text-sm font-bold tracking-tight">Harbour</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-600 text-sm text-zinc-300 hover:bg-[#292524] hover:text-white transition-colors bg-transparent cursor-pointer"
          >
            <span>New chat</span>
            <FontAwesomeIcon icon={faPenToSquare} className="text-zinc-500 text-xs" />
          </button>

          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-[#292524] transition-colors bg-transparent border-none cursor-pointer"
          >
            <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-xs" />
          </button>

          {username && (
            <>
              <div className="w-6 h-6 rounded-full bg-stone-600 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faUser} className="text-[10px] text-zinc-300" />
              </div>
              <button
                onClick={() => logout()}
                className="text-[11px] text-zinc-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer px-2"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex">
          <Sidebar onNewChat={startNewChat} />
        </div>

        <ConversationPanel
          messages={messages}
          isLoading={isPending}
          toolStatus={toolStatus ?? undefined}
          error={error}
          onSend={sendMessage}
        />

        {/* Desktop: fixed-width right panel */}
        {rightPanelData && (
          <div className="hidden lg:flex w-80 xl:w-96 shrink-0">
            <RightPanel data={rightPanelData} onDismiss={dismissRightPanel} />
          </div>
        )}

        {/* Mobile / tablet: bottom sheet */}
        {rightPanelData && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 max-h-[55vh] flex flex-col rounded-t-2xl shadow-2xl overflow-hidden border-t border-gray-200 dark:border-gray-700">
            <RightPanel data={rightPanelData} onDismiss={dismissRightPanel} />
          </div>
        )}
      </div>
    </div>
  );
};
