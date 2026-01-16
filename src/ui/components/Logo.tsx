"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

export const Logo = () => {
	const pathname = usePathname();

	if (pathname === "/") {
		return (
			<h1 className="flex items-center" aria-label="homepage">
				<Image
					src="/logo.png"
					alt="Sports Wholesale"
					width={1200}
					height={600}
					className="h-auto w-[1000px] md:w-[1300px] lg:w-[1600px]"
					priority
				/>
			</h1>
		);
	}
	return (
		<div className="flex items-center">
			<LinkWithChannel aria-label="homepage" href="/">
				<Image
					src="/logo.png"
					alt="Sports Wholesale"
					width={1200}
					height={600}
					className="h-auto w-[1000px] md:w-[1300px] lg:w-[1600px]"
				/>
			</LinkWithChannel>
		</div>
	);
};
