import { ChatLayout } from "./ChatLayout";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed bottom-0 right-0 z-50 w-full h-full sm:top-0 sm:max-w-md bg-white shadow-xl flex flex-col">
        <ChatLayout onClose={onClose} />
      </div>
    </>
  );
};
