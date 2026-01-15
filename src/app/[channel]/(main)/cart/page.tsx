import Image from "next/image";
import { CheckoutLink } from "./CheckoutLink";
import { DeleteLineButton } from "./DeleteLineButton";
import { PackGroup } from "./PackGroup";
import * as Checkout from "@/lib/checkout";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { groupCartItems } from "@/lib/cart-utils";

export const metadata = {
	title: "Shopping Cart · Sports Wholesale",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const checkoutId = await Checkout.getIdFromCookies(params.channel);

	const checkout = await Checkout.find(checkoutId);

	if (!checkout || checkout.lines.length < 1) {
		return (
			<section className="mx-auto max-w-7xl p-8">
				<h1 className="mt-8 text-3xl font-bold text-dark-text-primary">Your Shopping Cart is empty</h1>
				<p className="my-12 text-sm text-dark-text-secondary">
					Looks like you haven&apos;t added any items to the cart yet.
				</p>
				<LinkWithChannel href="/products" className="btn-primary inline-block max-w-full sm:px-16">
					Explore products
				</LinkWithChannel>
			</section>
		);
	}

	const cartItems = groupCartItems(checkout.lines);

	return (
		<section className="mx-auto max-w-7xl p-8">
			<h1 className="mt-8 text-3xl font-bold text-dark-text-primary">Your Shopping Cart</h1>
			<form className="mt-12">
				<ul
					data-testid="CartProductList"
					role="list"
					className="divide-y divide-dark-border border-b border-t border-dark-border"
				>
					{cartItems.map((cartItem) => {
						if (cartItem.type === "pack") {
							return <PackGroup key={cartItem.pack.packId} pack={cartItem.pack} checkoutId={checkoutId} />;
						}

						// Single item (non-pack)
						const item = cartItem.line;
						return (
							<li key={item.id} className="flex py-4">
								<div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-dark-border bg-dark-card sm:h-32 sm:w-32">
									{item.variant?.product?.thumbnail?.url && (
										<Image
											src={item.variant.product.thumbnail.url}
											alt={item.variant.product.thumbnail.alt ?? ""}
											width={200}
											height={200}
											className="h-full w-full object-contain object-center"
										/>
									)}
								</div>
								<div className="relative flex flex-1 flex-col justify-between p-4 py-2">
									<div className="flex justify-between justify-items-start gap-4">
										<div>
											<LinkWithChannel
												href={getHrefForVariant({
													productSlug: item.variant.product.slug,
													variantId: item.variant.id,
												})}
											>
												<h2 className="font-medium text-dark-text-primary">{item.variant?.product?.name}</h2>
											</LinkWithChannel>
											<p className="mt-1 text-sm text-dark-text-secondary">
												{item.variant?.product?.category?.name}
											</p>
											{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
												<p className="mt-1 text-sm text-dark-text-secondary">Variant: {item.variant.name}</p>
											)}
										</div>
										<p className="text-right font-semibold text-blue-600">
											{formatMoney(item.totalPrice.net.amount, item.totalPrice.net.currency)}
										</p>
									</div>
									<div className="flex justify-between">
										<div className="text-sm font-bold text-dark-text-primary">Qty: {item.quantity}</div>
										<DeleteLineButton checkoutId={checkoutId} lineId={item.id} />
									</div>
								</div>
							</li>
						);
					})}
				</ul>

				<div className="mt-12">
					<div className="card-dark px-4 py-2">
						<div className="flex items-center justify-between gap-2 py-2">
							<div>
								<p className="font-semibold text-dark-text-primary">Your Total</p>
								<p className="mt-1 text-sm text-dark-text-secondary">
									Shipping will be calculated in the next step
								</p>
							</div>
							<div className="font-medium text-blue-600">
								{formatMoney(checkout.totalPrice.gross.amount, checkout.totalPrice.gross.currency)}
							</div>
						</div>
					</div>
					<div className="mt-10 text-center">
						<CheckoutLink
							checkoutId={checkoutId}
							disabled={!checkout.lines.length}
							className="w-full sm:w-1/3"
						/>
					</div>
				</div>
			</form>
		</section>
	);
}
