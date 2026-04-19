import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { registerApi, externalLoginApi } from "../api/authApi";
import { currentUserQueryKey } from "../hooks/useCurrentUser";
import { registerSchema } from "../types/auth";
import type { ErrorResponse } from "../types/auth";
import type { AxiosError } from "axios";

const GOOGLE_CLIENT_ID = "792777166754-sn1bgl9c1h4o43cit76pps1r83h4joej.apps.googleusercontent.com";

declare const google: {
    accounts: {
        id: {
            initialize: (config: { client_id: string; callback: (r: { credential: string }) => void }) => void;
            renderButton: (el: HTMLElement, options: object) => void;
        };
    };
};

type FieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "password" | "confirmPassword", string>>;

export default function RegisterPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);

    const googleBtnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof google === "undefined" || !googleBtnRef.current) return;

        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async ({ credential }) => {
                setIsGoogleLoading(true);
                setServerError(null);
                try {
                    await externalLoginApi("google", credential);
                    await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
                    navigate("/", { replace: true });
                } catch {
                    setServerError("Google sign-up failed. Please try again.");
                } finally {
                    setIsGoogleLoading(false);
                }
            },
        });

        google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: googleBtnRef.current.offsetWidth,
        });
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setServerError(null);
        setFieldErrors({});

        const result = registerSchema.safeParse({ firstName, lastName, email, password, confirmPassword });
        if (!result.success) {
            const errors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path[0] as keyof FieldErrors;
                if (!errors[field]) errors[field] = issue.message;
            }
            setFieldErrors(errors);
            return;
        }

        setIsLoading(true);
        try {
            await registerApi(email, password, firstName || undefined, lastName || undefined);
            await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
            navigate("/", { replace: true });
        } catch (err) {
            const axiosErr = err as AxiosError<ErrorResponse>;
            setServerError(axiosErr.response?.data?.message ?? "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const inputClass = (field: keyof FieldErrors) =>
        `w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            fieldErrors[field]
                ? "border-red-400 dark:border-red-500"
                : "border-gray-200 dark:border-gray-700"
        }`;

    const isDisabled = isLoading || isGoogleLoading;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">H</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-1">
                        Create an account
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                        Start exploring properties today
                    </p>

                    {/* Server error banner */}
                    {serverError && (
                        <div className="mb-4 flex items-start gap-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-3">
                            <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <p className="text-sm text-red-700 dark:text-red-400">{serverError}</p>
                        </div>
                    )}

                    {/* Google button */}
                    <div className="mb-4">
                        {isGoogleLoading ? (
                            <div className="w-full flex items-center justify-center gap-2 h-10 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500">
                                <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing up with Google...
                            </div>
                        ) : (
                            <div ref={googleBtnRef} className="w-full" />
                        )}
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    First name <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    disabled={isDisabled}
                                    className={inputClass("firstName")}
                                    placeholder="Jane"
                                />
                                {fieldErrors.firstName && (
                                    <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Last name <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={isDisabled}
                                    className={inputClass("lastName")}
                                    placeholder="Smith"
                                />
                                {fieldErrors.lastName && (
                                    <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isDisabled}
                                className={inputClass("email")}
                                placeholder="you@example.com"
                            />
                            {fieldErrors.email && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isDisabled}
                                className={inputClass("password")}
                                placeholder="Min. 6 characters"
                            />
                            {fieldErrors.password && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isDisabled}
                                className={inputClass("confirmPassword")}
                                placeholder="••••••••"
                            />
                            {fieldErrors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isDisabled}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                        >
                            {isLoading && (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {isLoading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
