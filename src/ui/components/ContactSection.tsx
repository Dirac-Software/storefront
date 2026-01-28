export function ContactSection() {
	return (
		<section className="bg-dark-card/50 py-8">
			<div className="mx-auto max-w-7xl p-8 py-4">
				<h2 className="mb-8 text-center text-2xl font-bold text-dark-text-primary md:text-3xl">Get In Touch</h2>
				
				<div className="mx-auto max-w-3xl">
					<p className="mb-8 text-center text-dark-text-secondary">
						Trade enquiries are always welcome. If you would like to receive availability lists or discuss current stock, please get in touch.
					</p>

					<div className="grid gap-8 md:grid-cols-2">
						{/* Contact Information */}
						<div className="rounded-lg border border-dark-border bg-dark-card p-6">
							<h3 className="mb-4 text-lg font-semibold text-dark-text-primary">Contact Information</h3>
							<div className="space-y-3 text-sm text-dark-text-secondary">
								<div className="flex items-start gap-3">
									<span className="text-blue-500 mt-0.5">📧</span>
									<div>
										<p className="font-medium text-dark-text-primary">Email</p>
										<a href="mailto:info@sportswholesale.co.uk" className="text-blue-500 hover:text-blue-600">
											info@sportswholesale.co.uk
										</a>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<span className="text-blue-500 mt-0.5">📞</span>
									<div>
										<p className="font-medium text-dark-text-primary">Phone</p>
										<a href="tel:+442046008768" className="text-blue-500 hover:text-blue-600">
											+442046008768
										</a>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<span className="text-green-500 mt-0.5">💬</span>
									<div>
										<p className="font-medium text-dark-text-primary">WhatsApp</p>
										<a 
											href="https://api.whatsapp.com/send/?phone=447946672934&text&type=phone_number&app_absent=0"
											target="_blank"
											rel="noopener noreferrer"
											className="text-green-500 hover:text-green-400"
										>
											+447946672934
										</a>
									</div>
								</div>
							</div>
						</div>

						{/* Quick Message */}
						<div className="rounded-lg border border-dark-border bg-dark-card p-6">
							<h3 className="mb-4 text-lg font-semibold text-dark-text-primary">Let's Talk Business</h3>
							<div className="text-sm text-dark-text-secondary mb-6">
								<p>Whether you need a quick answer or want to discuss a larger order, we're here to help - please contact us.</p>
							</div>
							<a 
								href="/contact-us" 
								className="btn-primary inline-block w-full text-center"
							>
								Send Us a Message
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}