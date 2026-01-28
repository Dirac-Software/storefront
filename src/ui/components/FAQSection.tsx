"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
	question: string;
	answer: string;
}

const faqItems: FAQItem[] = [
	{
		question: "Who can buy from Sports Wholesale?",
		answer: "We work exclusively with trade customers including independent retailers, online sellers, marketplace sellers, and clearance and outlet operators. All stock is 100% authentic, sourced through established trade channels."
	},
	{
		question: "Is your stock genuine?",
		answer: "Yes, all stock is 100% authentic, sourced through established trade channels and supplied with the appropriate paperwork and provenance. We do not deal in replicas, grey imports, or unverified stock."
	},
	{
		question: "How quickly can you dispatch orders?",
		answer: "We hold all stock in the UK, ready for immediate dispatch. As a UK operation, we ensure fast dispatch with clear communication and no surprises."
	},
	{
		question: "What brands do you stock?",
		answer: "We specialise in genuine branded sportswear, footwear, and accessories from leading brands. Contact us for current availability lists and specific brand enquiries."
	},
	{
		question: "Do you offer dropshipping?",
		answer: "No, we are not a marketplace and we are not a dropship broker. We buy stock properly, hold it, and sell it as a wholesaler should. We believe in straightforward, traditional wholesale trading."
	},
	{
		question: "What are your minimum order quantities?",
		answer: "We understand the realities of retail and online selling because we have done it ourselves. That means realistic pack sizes, sensible size curves, and stock that actually sells – not just stock that looks good on a list."
	},
	{
		question: "How do I get started?",
		answer: "Simply contact us through our contact form, email info@sportswholesale.co.uk, or call us on +442046008768. We're always happy to discuss your requirements and provide our latest availability lists."
	},
	{
		question: "Can you source specific items?",
		answer: "If there is something you need that you do not see listed, we are always happy to discuss upcoming stock or tailored opportunities. With over 30 years of experience in sportswear buying, wholesale, and resale, we have extensive trade connections."
	}
];

function FAQItem({ item }: { item: FAQItem }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mb-3 rounded-lg border border-dark-border bg-dark-card overflow-hidden">
			<button
				className="flex w-full items-center justify-between p-4 text-left hover:bg-dark-card-hover transition-colors"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="font-medium text-dark-text-primary pr-4">{item.question}</span>
				<ChevronDown 
					className={`h-5 w-5 flex-shrink-0 text-dark-text-muted transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>
			{isOpen && (
				<div className="px-4 pb-4 -mt-1">
					<p className="text-sm text-dark-text-secondary">{item.answer}</p>
				</div>
			)}
		</div>
	);
}

export function FAQSection() {
	return (
		<section className="mx-auto max-w-7xl p-8 pt-4 pb-16">
			<h2 className="mb-2 text-center text-2xl font-bold text-dark-text-primary md:text-3xl">
				Frequently Asked Questions
			</h2>
			<p className="mb-6 text-center text-dark-text-secondary">
				Common questions about trading with Sports Wholesale and our services
			</p>

			<div className="mx-auto max-w-3xl">
				{faqItems.map((item, index) => (
					<FAQItem key={index} item={item} />
				))}
			</div>
		</section>
	);
}