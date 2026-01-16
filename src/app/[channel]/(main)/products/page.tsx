import Image from "next/image";
import { notFound } from "next/navigation";
import {
	ProductListPaginatedDocument,
	OrderDirection,
	ProductOrderField,
	CategoryBySlugDocument,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductsPerPage } from "@/app/config";

import { getPaginatedListVariables } from "@/lib/utils";
import { SortBy } from "@/ui/components/SortBy";

export const metadata = {
	title: "Products · Sports Wholesale",
	description: "Browse all wholesale sports products at Sports Wholesale",
};

const getSortVariables = (sortParam?: string | string[]) => {
	const sortValue = Array.isArray(sortParam) ? sortParam[0] : sortParam;

	switch (sortValue) {
		case "price-asc":
			return { field: ProductOrderField.MinimalPrice, direction: OrderDirection.Asc };
		case "price-desc":
			return { field: ProductOrderField.MinimalPrice, direction: OrderDirection.Desc };
		default:
			return { field: ProductOrderField.Name, direction: OrderDirection.Asc };
	}
};

export default async function Page(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor?: string | string[];
		direction?: string | string[];
		sort?: string | string[];
		category?: string | string[];
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortVariables = getSortVariables(searchParams.sort);

	// Get category slug from search params
	const categorySlug = Array.isArray(searchParams.category)
		? searchParams.category[0]
		: searchParams.category;

	// Fetch category data if category filter is applied
	let category = null;
	if (categorySlug) {
		const categoryData = await executeGraphQL(CategoryBySlugDocument, {
			variables: { slug: categorySlug },
			revalidate: 60,
		});
		category = categoryData.category;

		// If category slug provided but doesn't exist, show 404
		if (!category) {
			notFound();
		}
	}

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			...paginationVariables,
			channel: params.channel,
			sortBy: sortVariables,
			filter: category
				? {
						categories: [category.id],
					}
				: undefined,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	return (
		<>
			{/* Category Banner Hero */}
			{category?.backgroundImage && (
				<section className="relative h-48 overflow-hidden md:h-64">
					<Image
						src={category.backgroundImage.url}
						alt={category.backgroundImage.alt || category.name}
						fill
						className="object-cover"
						priority
						quality={90}
						sizes="100vw"
					/>
				</section>
			)}

			<section className="mx-auto max-w-7xl p-8 pb-16">
				{/* Fallback title if no banner image */}
				{categorySlug && !category?.backgroundImage && (
					<h1 className="mb-6 text-6xl font-bold capitalize text-dark-text-primary">
						{category?.name || categorySlug.replace(/-/g, " ")}
					</h1>
				)}
				<div className="mb-6 flex justify-end">
					<SortBy />
				</div>
				<h2 className="sr-only">Product list</h2>
				<ProductList products={products.edges.map((e) => e.node)} />
				<Pagination
					pageInfo={products.pageInfo}
					totalCount={products.totalCount ?? undefined}
					pageSize={ProductsPerPage}
				/>
			</section>
		</>
	);
}
