import edjsHTML from "editorjs-html";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import xss from "xss";
import { invariant } from "ts-invariant";
import { type WithContext, type Product } from "schema-dts";
import { PackSizeSelector } from "./PackSizeSelector";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { executeGraphQL } from "@/lib/graphql";
import { formatMoney, formatMoneyRange } from "@/lib/utils";
import { CheckoutAddPackDocument, ProductDetailsDocument, ProductListDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";
import { AvailabilityMessage } from "@/ui/components/AvailabilityMessage";

export async function generateMetadata(
	props: {
		params: Promise<{ slug: string; channel: string }>;
		searchParams: Promise<{ variant?: string }>;
	},
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	const productName = product.seoTitle || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;
	const productNameAndVariant = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: `${product.name} | ${product.seoTitle || (await parent).title?.absolute}`,
		description: product.seoDescription || productNameAndVariant,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/products/${encodeURIComponent(params.slug)}`
				: undefined,
		},
		openGraph: product.thumbnail
			? {
					images: [
						{
							url: product.thumbnail.url,
							alt: product.name,
						},
					],
				}
			: null,
	};
}

export async function generateStaticParams({ params }: { params: { channel: string } }) {
	const { products } = await executeGraphQL(ProductListDocument, {
		revalidate: 60,
		variables: { first: 20, channel: params.channel },
		withAuth: false,
	});

	const paths = products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
	return paths;
}

const parser = edjsHTML();

export default async function Page(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);
	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	// TypeScript doesn't know notFound() never returns, so we assert product is defined
	invariant(product, "Product must exist after notFound check");

	const firstImage = product.thumbnail;
	let description = null;
	if (product?.description) {
		try {
			const cleanDescription = product.description.trim();
			const parsed = JSON.parse(cleanDescription);
			description = parser.parse(parsed);
		} catch (error) {
			console.error("Failed to parse product description:", error);
			description = null;
		}
	}

	const variants = product.variants;
	const selectedVariantID = searchParams.variant;
	const selectedVariant = variants?.find(({ id }) => id === selectedVariantID);
	const productId = product.id; // Capture for use in server action

	async function addPack(formData: FormData) {
		"use server";

		const packSize = parseInt(formData.get("packSize") as string, 10);

		if (!packSize || packSize <= 0) {
			return;
		}

		const checkout = await Checkout.findOrCreate({
			checkoutId: await Checkout.getIdFromCookies(params.channel),
			channel: params.channel,
		});
		invariant(checkout, "This should never happen");

		await Checkout.saveIdToCookie(params.channel, checkout.id);

		// Check if a pack for this product already exists and remove it first
		const existingCheckout = await Checkout.find(checkout.id);
		if (existingCheckout) {
			const existingPackLines = existingCheckout.lines.filter(
				(line) =>
					line.variant.product.id === productId &&
					line.metadata?.some((m) => m.key === "is_pack_item" && m.value === "true"),
			);

			if (existingPackLines.length > 0) {
				// Delete existing pack lines for this product
				const { CheckoutDeleteLinesDocument } = await import("@/gql/graphql");
				await executeGraphQL(CheckoutDeleteLinesDocument, {
					variables: {
						checkoutId: checkout.id,
						lineIds: existingPackLines.map((line) => line.id),
					},
					cache: "no-cache",
				});
			}
		}

		// Add the new pack
		await executeGraphQL(CheckoutAddPackDocument, {
			variables: {
				id: checkout.id,
				productId: productId,
				packSize,
			},
			cache: "no-cache",
		});

		revalidatePath("/cart");
	}

	const isAvailable = variants?.some((variant) => variant.quantityAvailable) ?? false;

	const price = selectedVariant?.pricing?.price?.net
		? formatMoney(selectedVariant.pricing.price.net.amount, selectedVariant.pricing.price.net.currency)
		: isAvailable
			? formatMoneyRange({
					start: product?.pricing?.priceRange?.start?.net,
					stop: product?.pricing?.priceRange?.stop?.net,
				})
			: "";

	// Extract minimum order quantity from product attributes
	const minimumOrderQuantity = product.attributes?.find(
		(attr) => attr.attribute.slug === "minimum-order-quantity",
	)?.values?.[0]?.name;
	const minOrderQty = minimumOrderQuantity ? parseInt(minimumOrderQuantity, 10) : 0;

	// Calculate total available quantity across all variants
	const totalAvailableQuantity =
		variants?.reduce((sum, variant) => sum + (variant.quantityAvailable || 0), 0) || 0;

	// Calculate effective minimum (backend logic: min of available stock and minimum order quantity)
	const effectiveMinimum = Math.min(minOrderQty || totalAvailableQuantity, totalAvailableQuantity);

	// Extract brand from product attributes
	const brand = product.attributes?.find((attr) => attr.attribute.slug === "brand")?.values?.[0]?.name;

	// Extract SKU/product code from product attributes
	const productCode = product.attributes?.find(
		(attr) => attr.attribute.slug === "product-code" || attr.attribute.slug === "sku",
	)?.values?.[0]?.name;

	// Extract RRP from product attributes
	const rrpAttribute = product.attributes?.find((attr) => attr.attribute.slug === "rrp")?.values?.[0]?.name;
	const rrpValue = rrpAttribute ? parseFloat(rrpAttribute) : null;
	const currency =
		selectedVariant?.pricing?.price?.net.currency ||
		product?.pricing?.priceRange?.start?.net.currency ||
		"GBP";
	const rrpFormatted = rrpValue ? formatMoney(rrpValue, currency) : null;

	const productJsonLd: WithContext<Product> = {
		"@context": "https://schema.org",
		"@type": "Product",
		image: product.thumbnail?.url,
		...(selectedVariant
			? {
					name: `${product.name} - ${selectedVariant.name}`,
					description: product.seoDescription || `${product.name} - ${selectedVariant.name}`,
					offers: {
						"@type": "Offer",
						availability: selectedVariant.quantityAvailable
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: selectedVariant.pricing?.price?.net.currency,
						price: selectedVariant.pricing?.price?.net.amount,
					},
				}
			: {
					name: product.name,

					description: product.seoDescription || product.name,
					offers: {
						"@type": "AggregateOffer",
						availability: product.variants?.some((variant) => variant.quantityAvailable)
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: product.pricing?.priceRange?.start?.net.currency,
						lowPrice: product.pricing?.priceRange?.start?.net.amount,
						highPrice: product.pricing?.priceRange?.stop?.net.amount,
					},
				}),
	};

	return (
		<section className="mx-auto grid max-w-7xl p-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(productJsonLd),
				}}
			/>
			<form className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2" action={addPack}>
				{/* Left Column - Image + Trust Badges */}
				<div className="space-y-6">
					{firstImage && (
						<div className="overflow-hidden rounded-lg border border-dark-border bg-dark-card p-4">
							<ProductImageWrapper
								priority={true}
								alt={firstImage.alt ?? ""}
								width={1024}
								height={1024}
								src={firstImage.url}
							/>
						</div>
					)}

					{/* Trust Badges */}
					<div className="grid grid-cols-3 gap-4">
						<div className="text-center">
							<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg border border-dark-border bg-dark-card">
								<svg
									className="h-6 w-6 text-dark-text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<p className="text-xs font-semibold text-dark-text-primary">Authentic</p>
							<p className="text-xs text-dark-text-secondary">branded stock</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg border border-dark-border bg-dark-card">
								<svg
									className="h-6 w-6 text-dark-text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							</div>
							<p className="text-xs font-semibold text-dark-text-primary">UK dispatch</p>
							<p className="text-xs text-dark-text-secondary">Fast, direct from storage</p>
						</div>
						<div className="text-center">
							<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg border border-dark-border bg-dark-card">
								<svg
									className="h-6 w-6 text-dark-text-secondary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
							<p className="text-xs font-semibold text-dark-text-primary">Dedicated trade support</p>
							<p className="text-xs text-dark-text-secondary">Expert assistance</p>
						</div>
					</div>
				</div>

				{/* Right Column - Product Details */}
				<div className="flex flex-col space-y-4">
					<div>
						{brand && <p className="mb-2 text-sm font-medium uppercase text-dark-text-muted">{brand}</p>}
						<h1 className="mb-2 text-3xl font-bold tracking-tight text-dark-text-primary">{product?.name}</h1>
						{productCode && (
							<p className="mb-4 text-sm text-dark-text-secondary">Product Code: {productCode}</p>
						)}
						<p className="mb-6 text-2xl font-bold text-blue-600" data-testid="ProductElement_Price">
							Our Price: {price}
						</p>

						{/* RRP and Stock Info */}
						<div className="mb-6 space-y-1 text-dark-text-secondary">
							{rrpFormatted && <p className="text-xl font-bold">RRP: {rrpFormatted}</p>}
							{effectiveMinimum > 0 && <p className="text-base">Minimum order: {effectiveMinimum} units</p>}
							{totalAvailableQuantity > 0 && (
								<p className="text-base">In stock: {totalAvailableQuantity} units</p>
							)}
						</div>

						<AvailabilityMessage isAvailable={isAvailable} />

						<PackSizeSelector
							productId={product.id}
							channelSlug={params.channel}
							minimumOrderQuantity={effectiveMinimum}
							totalAvailableQuantity={totalAvailableQuantity}
						/>

						{description && (
							<div className="mt-8 space-y-6 text-sm text-dark-text-secondary">
								{description.map((content) => (
									<div key={content} dangerouslySetInnerHTML={{ __html: xss(content) }} />
								))}
							</div>
						)}
					</div>
				</div>
			</form>
		</section>
	);
}
