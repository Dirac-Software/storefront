import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ChannelSelect } from "./ChannelSelect";
import {
	ChannelsListDocument,
	MenuGetBySlugDocument,
	PagesListDocument,
	ShopInfoDocument,
} from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function Footer({ channel }: { channel: string }) {
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "footer", channel },
		revalidate: 60 * 60 * 24,
	});
	const pages = await executeGraphQL(PagesListDocument, {
		variables: { channel },
		revalidate: 60 * 60 * 24,
	});
	const shopInfo = await executeGraphQL(ShopInfoDocument, {
		revalidate: 60 * 60 * 24,
	});
	const channels = process.env.SALEOR_APP_TOKEN
		? await executeGraphQL(ChannelsListDocument, {
				withAuth: false, // disable cookie-based auth for this call
				headers: {
					// and use app token instead
					Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
				},
			})
		: null;
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-dark-border bg-dark-card">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<div className="grid grid-cols-1 gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
					{footerLinks.menu?.items?.map((item) => {
						return (
							<div key={item.id}>
								<h3 className="text-sm font-semibold text-dark-text-primary">{item.name}</h3>
								<ul className="mt-4 space-y-3">
									{item.children?.map((child) => {
										if (child.category) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel
														href={`/categories/${child.category.slug}`}
														className="text-dark-text-secondary transition-colors hover:text-dark-text-primary"
													>
														{child.category.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.collection) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel
														href={`/collections/${child.collection.slug}`}
														className="text-dark-text-secondary transition-colors hover:text-dark-text-primary"
													>
														{child.collection.name}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.page) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel
														href={`/${child.page.slug}`}
														className="text-dark-text-secondary transition-colors hover:text-dark-text-primary"
													>
														{child.page.title}
													</LinkWithChannel>
												</li>
											);
										}
										if (child.url) {
											return (
												<li key={child.id} className="text-sm">
													<LinkWithChannel
														href={child.url}
														className="text-dark-text-secondary transition-colors hover:text-dark-text-primary"
													>
														{child.name}
													</LinkWithChannel>
												</li>
											);
										}
										return null;
									})}
								</ul>
							</div>
						);
					})}

					{pages.pages?.edges && pages.pages.edges.length > 0 && (
						<div>
							<h3 className="text-sm font-semibold text-dark-text-primary">Information</h3>
							<ul className="mt-4 space-y-3">
								{pages.pages.edges.map((edge) => (
									<li key={edge.node.id} className="text-sm">
										<LinkWithChannel
											href={`/${edge.node.slug}`}
											className="text-dark-text-secondary transition-colors hover:text-dark-text-primary"
										>
											{edge.node.title}
										</LinkWithChannel>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Contact Information */}
					<div>
						<h3 className="text-sm font-semibold text-dark-text-primary">Contact</h3>
						<ul className="mt-4 space-y-3 text-sm text-dark-text-secondary">
							{shopInfo.shop?.companyAddress?.companyName && (
								<li className="font-medium text-dark-text-primary">
									{shopInfo.shop.companyAddress.companyName}
								</li>
							)}
							{shopInfo.shop?.companyAddress?.streetAddress1 && (
								<li>{shopInfo.shop.companyAddress.streetAddress1}</li>
							)}
							{shopInfo.shop?.companyAddress?.streetAddress2 && (
								<li>{shopInfo.shop.companyAddress.streetAddress2}</li>
							)}
							{(shopInfo.shop?.companyAddress?.city || shopInfo.shop?.companyAddress?.postalCode) && (
								<li>
									{shopInfo.shop.companyAddress.city}
									{shopInfo.shop.companyAddress.city && shopInfo.shop.companyAddress.postalCode && " "}
									{shopInfo.shop.companyAddress.postalCode}
								</li>
							)}
							{shopInfo.shop?.companyAddress?.country?.country && (
								<li>{shopInfo.shop.companyAddress.country.country}</li>
							)}
							{shopInfo.shop?.companyAddress?.phone && (
								<li>
									<a
										href={`tel:${shopInfo.shop.companyAddress.phone}`}
										className="transition-colors hover:text-dark-text-primary"
									>
										{shopInfo.shop.companyAddress.phone}
									</a>
								</li>
							)}
							<li>
								<a
									href="mailto:info@sportswholesale.co.uk"
									className="transition-colors hover:text-dark-text-primary"
								>
									info@sportswholesale.co.uk
								</a>
							</li>
							<li>
								<a
									href="https://api.whatsapp.com/send/?phone=447946672934&text&type=phone_number&app_absent=0"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 text-green-500 transition-colors hover:text-green-400"
								>
									<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
									</svg>
									WhatsApp Us
								</a>
							</li>
							<li className="pt-2 border-t border-dark-border mt-2">
								<div className="text-dark-text-muted text-xs uppercase tracking-wide mb-2">Business Hours</div>
								<div className="space-y-1">
									<div>Mon-Fri: 9:00 AM - 5:30 PM</div>
									<div>Sat-Sun: Closed</div>
								</div>
							</li>
						</ul>
					</div>
				</div>

				{channels?.channels && (
					<div className="mb-6 border-t border-dark-border pt-8">
						<label className="flex items-center gap-2">
							<span className="text-sm text-dark-text-secondary">Change currency:</span>
							<ChannelSelect channels={channels.channels} />
						</label>
					</div>
				)}

				<div className="flex flex-col justify-between gap-4 border-t border-dark-border py-8 sm:flex-row sm:items-center">
					<div className="flex flex-col gap-4">
						<p className="text-sm text-dark-text-secondary">
							SportsWholesale is operated by Dirac Group Limited. &copy; {currentYear} Dirac Software Limited. All rights reserved.
						</p>
						<p className="text-sm text-dark-text-secondary">
							VAT GB 424528208. Registered in England and Wales No. 13570843
						</p>
					</div>
					<div className="flex items-center justify-end">
						<LinkWithChannel href="/">
							<Image
								src="/logo.png"
								alt="Sports Wholesale"
								width={400}
								height={200}
								className="h-auto w-64 opacity-90 transition-opacity hover:opacity-100 md:w-80"
							/>
						</LinkWithChannel>
					</div>
				</div>
			</div>
		</footer>
	);
}
