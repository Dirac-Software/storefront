import Link from "next/link";

export default async function CheckoutErrorPage({
	searchParams,
}: {
	searchParams: Promise<{ reason?: string }>;
}) {
	const params = await searchParams;
	const errorReason = params.reason || "An unexpected error occurred";

	return (
		<div className="mx-auto max-w-2xl p-8">
			<div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
				<div className="mb-6">
					<svg
						className="mx-auto h-16 w-16 text-red-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>

				<h1 className="mb-4 text-3xl font-bold text-red-900">Checkout Failed</h1>

				<div className="mb-6">
					<p className="mb-4 text-lg text-red-800">{errorReason}</p>
					<p className="text-base font-semibold text-red-900">You have not been charged.</p>
				</div>

				<Link
					href="/checkout"
					className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
				>
					Return to Checkout
				</Link>
			</div>
		</div>
	);
}
