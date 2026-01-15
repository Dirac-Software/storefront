import { Logo } from "./Logo";
import { Nav } from "./nav/Nav";

export function Header({ channel }: { channel: string }) {
	return (
		<header className="sticky top-0 z-20 border-b border-dark-border bg-dark-card/95 shadow-lg backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-3 sm:px-8">
				<div className="flex h-32 items-center justify-between gap-4 md:h-40 md:gap-8 lg:h-48">
					<Logo />
					<Nav channel={channel} />
				</div>
			</div>
		</header>
	);
}
