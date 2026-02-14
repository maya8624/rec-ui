import React from "react";

interface ChatbotButtonProps {
  onClick: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed 
        bottom-6 
        right-6 
        z-50
        flex 
        items-center 
        justify-center
        w-14 
        h-14 
        md:w-16 
        md:h-16
        rounded-full
        bg-blue-600 
        hover:bg-blue-700
        text-white
        shadow-xl
        transition-all
        duration-300
        hover:scale-110
      "
    >
      💬
    </button>
  );
};

export default ChatbotButton;
