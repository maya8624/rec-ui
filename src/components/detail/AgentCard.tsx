import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface AgentCardProps {
  agent: {
    name: string;
    phone: string;
    agency: string;
    photo: string;
  };
  listedDate: string;
}

export default function AgentCard({ agent, listedDate }: AgentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 sticky top-24">
      <div className="text-center mb-4">
        <img
          src={agent.photo}
          alt={agent.name}
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
        />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {agent.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{agent.agency}</p>
      </div>

      <div className="space-y-3">
        <a
          href={`tel:${agent.phone}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors no-underline text-sm"
        >
          <FontAwesomeIcon icon={faPhone} />
          {agent.phone}
        </a>
        <button className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 transition-colors cursor-pointer text-sm">
          <FontAwesomeIcon icon={faEnvelope} />
          Email Agent
        </button>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
        Listed {listedDate}
      </p>
    </div>
  );
}
