"use client";

import clsx from "clsx";
import { type ReactElement } from "react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import useSelectedPathname from "@/hooks/useSelectedPathname";
import { useSearchParams } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: ReactElement | string }) {
	const pathname = useSelectedPathname();
	const searchParams = useSearchParams();

	// Parse href to separate pathname and query string
	const [hrefPath, hrefQuery] = href.split("?");
	const hrefParams = new URLSearchParams(hrefQuery || "");

	// Check if pathname matches
	const pathMatches = pathname === hrefPath;

	// Check if all query params in href match current search params
	let paramsMatch = true;
	hrefParams.forEach((value, key) => {
		if (searchParams.get(key) !== value) {
			paramsMatch = false;
		}
	});

	// For links without query params (like /products), only active if no query params present
	const hasNoQueryParams = hrefQuery === undefined || hrefQuery === "";
	const currentHasNoParams = !searchParams.toString();

	const isActive = pathMatches && (hasNoQueryParams ? currentHasNoParams : paramsMatch);

	return (
		<li className="inline-flex">
			<LinkWithChannel
				href={href}
				className={clsx(
					isActive ? "border-black text-black" : "border-transparent text-neutral-700 hover:text-black",
					"inline-flex items-center border-b-2 pt-px text-base font-semibold transition-colors",
				)}
			>
				{children}
			</LinkWithChannel>
		</li>
	);
}
