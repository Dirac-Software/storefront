import { type Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
	title: "Contact Us · Sports Wholesale",
	description: "Get in touch with Sports Wholesale for all trade enquiries",
};

export default function ContactUsPage() {
	return (
		<div className="mx-auto max-w-3xl p-8 pb-16">
			<h1 className="mb-6 text-3xl font-semibold">Contact Us</h1>
			<p className="mb-8 text-dark-text-secondary">
				Trade enquiries are always welcome. If you would like to receive availability lists or discuss current stock, please get in touch.
			</p>
			
			<div className="mb-8 rounded-lg border border-dark-border bg-dark-card p-6">
				<h2 className="mb-4 text-xl font-semibold text-dark-text-primary">Business Hours</h2>
				<div className="space-y-2 text-dark-text-secondary">
					<p>Monday - Friday: 9:00 AM - 5:30 PM</p>
					<p>Saturday - Sunday: Closed</p>
				</div>
			</div>
			
			<ContactForm />
		</div>
	);
}