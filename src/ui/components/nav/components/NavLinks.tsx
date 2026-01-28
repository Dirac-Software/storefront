import { NavLink } from "./NavLink";
import { executeGraphQL } from "@/lib/graphql";
import { CategoriesListDocument } from "@/gql/graphql";

export const NavLinks = async () => {
	// Fetch categories directly
	const categoriesData = await executeGraphQL(CategoriesListDocument, {
		revalidate: 60 * 60 * 24,
	});

	const categories = categoriesData.categories?.edges.map(({ node }) => node) || [];

	return (
		<>
			<NavLink href="/products">All Products</NavLink>
			{categories.map((category) => (
				<NavLink key={category.id} href={`/products?category=${category.slug}`}>
					{category.name}
				</NavLink>
			))}
		</>
	);
};
