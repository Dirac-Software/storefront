import { type Metadata } from "next";

export const metadata: Metadata = {
	title: "About Us · Sports Wholesale",
	description: "Learn about Sports Wholesale - Your trusted partner for wholesale sports equipment and apparel",
};

export default function AboutUsPage() {
	return (
		<div className="mx-auto max-w-4xl p-8 pb-16">
			<h1 className="mb-6 text-3xl font-semibold text-dark-text-primary">About Sports Wholesale</h1>
			
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
			
			<div className="prose prose-sm prose-neutral max-w-none prose-headings:mb-3 prose-headings:mt-6 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
				<h2 className="flex items-center gap-2 text-xl font-semibold text-dark-text-primary">
					<span className="text-blue-500">🏢</span> Who We Are
				</h2>
				<p className="text-dark-text-secondary">
					SportsWholesale.co.uk is a UK-based sportswear wholesaler built on over 30 years of hands-on experience buying and selling branded sportswear.
				</p>
				<p className="text-dark-text-secondary">
					We specialise in genuine branded sportswear, footwear, and accessories, supplying retailers, online sellers, and trade customers across the UK and Europe.
				</p>
				<p className="text-dark-text-secondary">
					All stock is 100% authentic, sourced through established trade channels and supplied with the appropriate paperwork and provenance. We do not deal in replicas, grey imports, or unverified stock.
				</p>

				<h2 className="flex items-center gap-2 text-xl font-semibold text-dark-text-primary">
					<span className="text-blue-500">📦</span> What We Do
				</h2>
				<p className="text-dark-text-secondary">
					Our focus is straightforward and trade-led:
				</p>
				<ul className="text-dark-text-secondary list-disc pl-6">
					<li>Branded sportswear, footwear, and accessories</li>
					<li>Clear wholesale pricing</li>
					<li>UK-held stock, ready for immediate dispatch</li>
					<li>Simple, no-nonsense buying</li>
				</ul>
				<p className="text-dark-text-secondary">
					We understand the realities of retail and online selling because we have done it ourselves. That means realistic pack sizes, sensible size curves, and stock that actually sells – not just stock that looks good on a list.
				</p>

				<h2 className="flex items-center gap-2 text-xl font-semibold text-dark-text-primary">
					<span className="text-green-500">✓</span> Why Trade With Us
				</h2>
				<ul className="text-dark-text-secondary list-disc pl-6">
					<li><strong>Experience that matters</strong> – over three decades in sportswear buying, wholesale, and resale</li>
					<li><strong>Genuine stock only</strong> – branded goods supplied with supporting documentation</li>
					<li><strong>UK operation</strong> – fast dispatch, clear communication, no surprises</li>
					<li><strong>Trade-focused</strong> – built for retailers, not consumers</li>
				</ul>
				
				{/* Emphasized "Not a Marketplace" statement */}
				<div className="my-4 rounded-lg border-l-4 border-blue-500 bg-dark-card/50 p-4">
					<p className="text-dark-text-primary font-medium italic">
						"We are not a marketplace and we are not a dropship broker. We buy stock properly, hold it, and sell it as a wholesaler should."
					</p>
				</div>

				<h2 className="flex items-center gap-2 text-xl font-semibold text-dark-text-primary">
					<span className="text-blue-500">👥</span> Who We Supply
				</h2>
				<p className="text-dark-text-secondary">
					We work with a wide range of trade customers, including:
				</p>
				<ul className="text-dark-text-secondary list-disc pl-6">
					<li>Independent retailers</li>
					<li>Online sellers</li>
					<li>Marketplace sellers</li>
					<li>Clearance and outlet operators</li>
				</ul>
				<p className="text-dark-text-secondary">
					Whether you're looking for a one-off opportunity buy or regular access to branded sportswear stock, we aim to be easy to deal with and reliable over the long term.
				</p>

				<h2 className="flex items-center gap-2 text-xl font-semibold text-dark-text-primary">
					<span className="text-blue-500">🎯</span> Our Approach
				</h2>
				<p className="text-dark-text-secondary">
					SportsWholesale.co.uk was set up to do things properly:
				</p>
				<div className="mt-3 space-y-3">
					<div>
						<p className="text-sm font-medium text-dark-text-primary mb-1">Transparency</p>
						<ul className="text-dark-text-secondary list-disc pl-6">
							<li>Clear, accurate information</li>
							<li>Honest stock descriptions</li>
						</ul>
					</div>
					<div>
						<p className="text-sm font-medium text-dark-text-primary mb-1">Relationships</p>
						<ul className="text-dark-text-secondary list-disc pl-6">
							<li>Responsive, human contact</li>
							<li>Long-term trade relationships</li>
						</ul>
					</div>
				</div>
				<p className="text-dark-text-secondary mt-4">
					If there is something you need that you do not see listed, we are always happy to discuss upcoming stock or tailored opportunities.
				</p>

				{/* Call to Action Box */}
				<div className="mt-8 rounded-lg border border-blue-500/30 bg-blue-500/10 p-6 text-center">
					<h3 className="mb-3 text-lg font-semibold text-dark-text-primary">Ready to Trade?</h3>
					<p className="mb-4 text-dark-text-secondary">
						Get in touch with our team to discuss your requirements and receive our latest availability lists.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
						<a href="/contact-us" className="btn-primary inline-block">
							Get In Touch
						</a>
						<span className="text-dark-text-muted">or</span>
						<a href="tel:+442046008768" className="text-blue-500 hover:text-blue-600 font-medium">
							Call us on: +442046008768
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}