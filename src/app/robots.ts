import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://sportswholesale.co.uk";

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/checkout", "/cart", "/login", "/orders"],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
