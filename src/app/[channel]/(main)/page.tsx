import Image from "next/image";
import { CollectionsListDocument, CategoriesListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductCarousel } from "@/ui/components/ProductCarousel";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { AboutSection } from "@/ui/components/AboutSection";
import { ContactSection } from "@/ui/components/ContactSection";
import { FAQSection } from "@/ui/components/FAQSection";

export const metadata = {
	title: "Sports Wholesale - Wholesale Sports Equipment",
	description:
		"Sports Wholesale - Your trusted source for wholesale sports equipment and apparel. Browse our extensive collection of quality sports products.",
};

// Fallback banner images if categories don't have background images
const fallbackImages: Record<string, string> = {
	footwear: "/banner-footwear.jpeg",
	apparel: "/banner-apparel.jpeg",
	accessories: "/banner-accessories.jpeg",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Fetch categories from Saleor
	const categoriesData = await executeGraphQL(CategoriesListDocument, {
		revalidate: 60,
	});

	// Fetch all collections
	const collectionsData = await executeGraphQL(CollectionsListDocument, {
		variables: {
			channel: params.channel,
		},
		revalidate: 60,
	});

	const categories = categoriesData.categories?.edges.map(({ node }) => node) || [];

	// Process collections (filtering now done at GraphQL level)
	const collections =
		collectionsData.collections?.edges.map(({ node }) => ({
			id: node.id,
			name: node.name,
			slug: node.slug,
			products: node.products?.edges.map(({ node: product }) => product) || [],
		})) || [];

	return (
		<>
			{/* Hero Section */}
			<section className="mx-auto max-w-7xl px-8 pt-12 pb-8 text-center">
				<h1 className="text-2xl font-bold text-dark-text-primary md:text-3xl lg:text-4xl">
					Wholesale Sportswear, Footwear & Apparel
				</h1>
				<p className="mt-4 text-xl text-dark-text-secondary md:text-2xl">
					Branded wholesale for retailers & online sellers
				</p>
			</section>

			{/* Category Banners Section */}
			<section className="mx-auto max-w-7xl p-8 pt-0">
				<h2 className="mb-6 text-center text-2xl font-bold text-dark-text-primary md:text-3xl">
					Shop by Category
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{categories.map((category) => {
						// Use Saleor background image if available, otherwise use fallback
						const imageUrl =
							category.backgroundImage?.url || fallbackImages[category.slug] || "/banner-accessories.jpeg";

						return (
							<LinkWithChannel
								key={category.id}
								href={`/products?category=${category.slug}`}
								className="group relative overflow-hidden rounded-lg border border-dark-border shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-2xl"
							>
								<div className="relative aspect-[4/3]">
									<Image
										src={imageUrl}
										alt={category.backgroundImage?.alt || category.name}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-110"
										sizes="(max-width: 768px) 100vw, 33vw"
										priority
									/>
								</div>
							</LinkWithChannel>
						);
					})}
				</div>
			</section>

			{/* Collections Sections - Display all collections */}
			{collections.map((collection) =>
				collection.products.length > 0 ? (
					<section key={collection.id} className="mx-auto max-w-7xl p-8 py-6">
						<h2 className="mb-6 text-center text-2xl font-bold text-dark-text-primary md:text-3xl">
							{collection.name}
						</h2>
						<ProductCarousel products={collection.products} />
					</section>
				) : null,
			)}

			{/* About Section */}
			<AboutSection />

			{/* Contact Section */}
			<ContactSection />

			{/* FAQ Section */}
			<FAQSection />
		</>
	);
}
