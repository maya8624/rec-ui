import type { UserRole } from "../../types/chat";

interface Props {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}

export const RoleSelector = ({ selectedRole, onChange }: Props) => {
  const roles: UserRole[] = ["buyer", "seller", "agent"];

  return (
    <div className="bg-white px-4 py-3 flex flex-wrap justify-center gap-3 border-b">
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => onChange(role)}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
            selectedRole === role
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      ))}
    </div>
  );
};
