export function AboutSection() {
	return (
		<section className="mx-auto max-w-7xl p-8 pt-4 pb-4">
			<h2 className="mb-6 text-center text-2xl font-bold text-dark-text-primary md:text-3xl">About Sports Wholesale</h2>
			
			{/* Key Credentials Box */}
			<div className="mb-8 flex flex-wrap justify-center gap-4 rounded-lg border border-dark-border bg-dark-card/50 p-4">
				<div className="flex items-center gap-2 px-4 py-2">
					<span className="text-blue-500">✓</span>
					<span className="text-sm font-medium text-dark-text-primary">30+ Years Experience</span>
				</div>
				<div className="flex items-center gap-2 border-l border-dark-border px-4 py-2">
					<span className="text-blue-500">✓</span>
					<span className="text-sm font-medium text-dark-text-primary">100% Authentic Stock</span>
				</div>
				<div className="flex items-center gap-2 border-l border-dark-border px-4 py-2">
					<span className="text-blue-500">✓</span>
					<span className="text-sm font-medium text-dark-text-primary">Branded Goods</span>
				</div>
			</div>

			<div className="grid gap-8 md:grid-cols-2">
				<div>
					<h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-dark-text-primary">
						<span className="text-blue-500">🏢</span> Who We Are
					</h3>
					<p className="mb-4 text-sm text-dark-text-secondary">
						SportsWholesale.co.uk is a UK-based sportswear wholesaler built on over 30 years of hands-on experience buying and selling branded sportswear.
					</p>
					<p className="text-sm text-dark-text-secondary">
						We specialise in genuine branded sportswear, footwear, and accessories, supplying retailers, online sellers, and trade customers across the UK and Europe.
					</p>
				</div>

				<div>
					<h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-dark-text-primary">
						<span className="text-blue-500">📦</span> What We Do
					</h3>
					<ul className="space-y-2 text-sm text-dark-text-secondary">
						<li className="flex items-start gap-2">
							<span className="text-blue-500 mt-0.5">•</span>
							<span>Branded sportswear, footwear, and accessories</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-blue-500 mt-0.5">•</span>
							<span>Clear wholesale pricing</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-blue-500 mt-0.5">•</span>
							<span>UK-held stock, ready for immediate dispatch</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-blue-500 mt-0.5">•</span>
							<span>Simple, no-nonsense buying</span>
						</li>
					</ul>
				</div>
			</div>

			{/* Emphasized "Not a Marketplace" statement */}
			<div className="mt-8 rounded-lg border-l-4 border-blue-500 bg-dark-card/50 p-4">
				<p className="text-center text-dark-text-primary font-medium italic">
					"We are not a marketplace and we are not a dropship broker. We buy stock properly, hold it, and sell it as a wholesaler should."
				</p>
			</div>

			<div className="mt-6 text-center">
				<a href="/about-us" className="text-blue-500 hover:text-blue-600 font-medium">
					Learn more about us →
				</a>
			</div>
		</section>
	);
}