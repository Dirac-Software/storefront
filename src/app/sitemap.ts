import { type MetadataRoute } from "next";
import { executeGraphQL } from "@/lib/graphql";
import {
	ProductListDocument,
	CategoriesListDocument,
	CollectionsListDocument,
	PagesListDocument,
} from "@/gql/graphql";
import { DefaultChannelSlug } from "@/app/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://sportswholesale.co.uk";
	const channel = DefaultChannelSlug;

	const sitemap: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/products`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
	];

	// Fetch all products (limit to 100 for performance, adjust as needed)
	try {
		const productsData = await executeGraphQL(ProductListDocument, {
			variables: {
				channel,
				first: 100,
			},
			revalidate: 3600, // Cache for 1 hour
			withAuth: false, // Disable cookie-based auth for static generation
		});

		if (productsData.products?.edges) {
			productsData.products.edges.forEach(({ node: product }) => {
				sitemap.push({
					url: `${baseUrl}/products/${product.slug}`,
					lastModified: new Date(),
					changeFrequency: "weekly",
					priority: 0.8,
				});
			});
		}
	} catch (error) {
		console.error("Error fetching products for sitemap:", error);
	}

	// Fetch all categories
	try {
		const categoriesData = await executeGraphQL(CategoriesListDocument, {
			revalidate: 3600,
			withAuth: false, // Disable cookie-based auth for static generation
		});

		if (categoriesData.categories?.edges) {
			categoriesData.categories.edges.forEach(({ node: category }) => {
				sitemap.push({
					url: `${baseUrl}/products?category=${category.slug}`,
					lastModified: new Date(),
					changeFrequency: "weekly",
					priority: 0.7,
				});
			});
		}
	} catch (error) {
		console.error("Error fetching categories for sitemap:", error);
	}

	// Fetch all collections
	try {
		const collectionsData = await executeGraphQL(CollectionsListDocument, {
			variables: { channel },
			revalidate: 3600,
			withAuth: false, // Disable cookie-based auth for static generation
		});

		if (collectionsData.collections?.edges) {
			collectionsData.collections.edges.forEach(({ node: collection }) => {
				sitemap.push({
					url: `${baseUrl}/collections/${collection.slug}`,
					lastModified: new Date(),
					changeFrequency: "weekly",
					priority: 0.7,
				});
			});
		}
	} catch (error) {
		console.error("Error fetching collections for sitemap:", error);
	}

	// Fetch all pages
	try {
		const pagesData = await executeGraphQL(PagesListDocument, {
			variables: { channel },
			revalidate: 3600,
			withAuth: false, // Disable cookie-based auth for static generation
		});

		if (pagesData.pages?.edges) {
			pagesData.pages.edges.forEach(({ node: page }) => {
				sitemap.push({
					url: `${baseUrl}/${page.slug}`,
					lastModified: new Date(),
					changeFrequency: "monthly",
					priority: 0.6,
				});
			});
		}
	} catch (error) {
		console.error("Error fetching pages for sitemap:", error);
	}

	return sitemap;
}
