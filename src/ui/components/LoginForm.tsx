"use client";

import { useActionState } from "react";
import { handleLogin } from "./LoginForm.actions";

export function LoginForm() {
	const [state, formAction, isPending] = useActionState(handleLogin, null);

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form className="rounded border p-8 shadow-md" action={formAction}>
				{state?.error && (
					<div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
						{state.error}
					</div>
				)}
				<div className="mb-2">
					<label className="sr-only" htmlFor="email">
						Email
					</label>
					<input
						required
						type="email"
						name="email"
						placeholder="Email"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
						disabled={isPending}
					/>
				</div>
				<div className="mb-4">
					<label className="sr-only" htmlFor="password">
						Password
					</label>
					<input
						required
						type="password"
						name="password"
						placeholder="Password"
						autoCapitalize="off"
						autoComplete="off"
						className="w-full rounded border bg-neutral-50 px-4 py-2"
						disabled={isPending}
					/>
				</div>

				<button
					className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700 disabled:opacity-50"
					type="submit"
					disabled={isPending}
				>
					{isPending ? "Logging in..." : "Log In"}
				</button>
			</form>
			<div></div>
		</div>
	);
}
