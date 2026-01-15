import { type ReactNode } from "react";
import { Footer } from "@/ui/components/Footer";
import { Header } from "@/ui/components/Header";

export const metadata = {
	title: "Sports Wholesale",
	description: "Sports Wholesale - Your trusted source for wholesale sports equipment and apparel.",
};

export default async function RootLayout(props: {
	children: ReactNode;
	params: Promise<{ channel: string }>;
}) {
	const channel = (await props.params).channel;

	return (
		<>
			<Header channel={channel} />
			<div className="flex min-h-[calc(100dvh-128px)] flex-col md:min-h-[calc(100dvh-160px)] lg:min-h-[calc(100dvh-192px)]">
				<main className="flex-1">{props.children}</main>
				<Footer channel={channel} />
			</div>
		</>
	);
}
