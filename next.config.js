/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
	},
	typedRoutes: false,
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
	async rewrites() {
		const channel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel";
		return [
			// Root page
			{
				source: "/",
				destination: `/${channel}`,
			},
			// Map static pages directly to root (e.g., /about-us instead of /pages/about-us)
			{
				source: "/:slug(about-us|contact-us|cookie-policy|privacy-policy|returns-policy|terms-conditions)",
				destination: `/${channel}/pages/:slug`,
			},
			// Catch-all: map everything else with channel prefix
			{
				source: "/:path*",
				destination: `/${channel}/:path*`,
			},
		];
	},
};

export default config;
