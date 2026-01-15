import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	const brand = product.attributes?.find((attr) => attr.attribute.slug === "brand")?.values?.[0]?.name;

	return (
		<li data-testid="ProductElement">
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div className="card-dark p-4">
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={512}
							height={512}
							sizes={"512px"}
							priority={priority}
						/>
					)}
					<div className="mt-3 flex justify-between">
						<div>
							{brand && <p className="text-xs font-medium uppercase text-dark-text-muted">{brand}</p>}
							<h3 className="mt-1 text-sm font-semibold text-dark-text-primary">{product.name}</h3>
							<p className="mt-1 text-sm text-dark-text-secondary" data-testid="ProductElement_Category">
								{product.category?.name}
							</p>
						</div>
						<p className="mt-1 text-sm font-medium text-blue-600" data-testid="ProductElement_PriceRange">
							{formatMoneyRange({
								start: product?.pricing?.priceRange?.start?.net,
								stop: product?.pricing?.priceRange?.stop?.net,
							})}
						</p>
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}
