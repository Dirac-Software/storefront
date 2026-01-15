"use client";

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export function Pagination({
	pageInfo,
	totalCount,
	pageSize,
}: {
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		endCursor?: string | null;
		startCursor?: string | null;
	};
	totalCount?: number;
	pageSize?: number;
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Get current page from URL or default to 1
	const currentPage = parseInt(searchParams.get("page") || "1", 10);

	// Construct next and previous page URLs based on the current search parameters
	// and the pageInfo provided.
	const nextSearchParams = new URLSearchParams(searchParams);
	nextSearchParams.set("cursor", pageInfo.endCursor ?? "");
	nextSearchParams.set("direction", "next");
	nextSearchParams.set("page", String(currentPage + 1));
	const nextPageUrl = `${pathname}?${nextSearchParams.toString()}`;

	const prevSearchParams = new URLSearchParams(searchParams);
	prevSearchParams.set("cursor", pageInfo.startCursor ?? "");
	prevSearchParams.set("direction", "prev");
	prevSearchParams.set("page", String(Math.max(1, currentPage - 1)));
	const prevPageUrl = `${pathname}?${prevSearchParams.toString()}`;

	// Calculate total pages if totalCount and pageSize are provided
	const totalPages = totalCount && pageSize ? Math.ceil(totalCount / pageSize) : null;

	return (
		<nav className="flex items-center justify-center gap-x-4 border-dark-border px-4 pt-12">
			<Link
				href={pageInfo.hasPreviousPage ? prevPageUrl : "#"}
				className={clsx("rounded px-4 py-2 text-sm font-medium", {
					"bg-blue-500 text-white hover:bg-blue-600": pageInfo.hasPreviousPage,
					"cursor-not-allowed border border-dark-border text-dark-text-muted": !pageInfo.hasPreviousPage,
					"pointer-events-none": !pageInfo.hasPreviousPage,
				})}
				aria-disabled={!pageInfo.hasPreviousPage}
			>
				Previous
			</Link>

			{totalPages && (
				<span className="px-4 py-2 text-sm font-medium text-dark-text-secondary">
					Page {currentPage} of {totalPages}
				</span>
			)}

			<Link
				href={pageInfo.hasNextPage ? nextPageUrl : "#"}
				className={clsx("rounded px-4 py-2 text-sm font-medium", {
					"bg-blue-500 text-white hover:bg-blue-600": pageInfo.hasNextPage,
					"cursor-not-allowed border border-dark-border text-dark-text-muted": !pageInfo.hasNextPage,
					"pointer-events-none": !pageInfo.hasNextPage,
				})}
				aria-disabled={!pageInfo.hasNextPage}
			>
				Next
			</Link>
		</nav>
	);
}
