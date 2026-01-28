"use client";
import Link from "next/link";
import { type ComponentProps } from "react";

export const LinkWithChannel = ({
	href,
	...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) => {
	// Channel prefix is now handled by rewrites in next.config.js
	// Links work directly without channel in the URL
	return <Link {...props} href={href} />;
};
