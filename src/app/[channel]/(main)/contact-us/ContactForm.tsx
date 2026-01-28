"use client";

import { useState } from "react";
import { sendContactEmail } from "./actions";

export function ContactForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

	async function handleSubmit(formData: FormData) {
		setIsSubmitting(true);
		setSubmitStatus(null);

		try {
			const result = await sendContactEmail(formData);
			if (result.success) {
				setSubmitStatus({ type: "success", message: "Thank you for your enquiry. We'll get back to you soon!" });
				// Reset form
				const form = document.getElementById("contact-form") as HTMLFormElement;
				form?.reset();
			} else {
				setSubmitStatus({ type: "error", message: result.error || "Failed to send message. Please try again." });
			}
		} catch (error) {
			setSubmitStatus({ type: "error", message: "An unexpected error occurred. Please try again." });
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form id="contact-form" action={handleSubmit} className="space-y-6">
			<div>
				<label htmlFor="businessName" className="mb-2 block text-sm font-medium text-dark-text-primary">
					Business Name *
				</label>
				<input
					type="text"
					id="businessName"
					name="businessName"
					required
					className="input-dark w-full rounded-md px-4 py-2"
					placeholder="Your business name"
				/>
			</div>

			<div>
				<label htmlFor="contactName" className="mb-2 block text-sm font-medium text-dark-text-primary">
					Contact Name *
				</label>
				<input
					type="text"
					id="contactName"
					name="contactName"
					required
					className="input-dark w-full rounded-md px-4 py-2"
					placeholder="Your name"
				/>
			</div>

			<div>
				<label htmlFor="email" className="mb-2 block text-sm font-medium text-dark-text-primary">
					Email Address *
				</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					className="input-dark w-full rounded-md px-4 py-2"
					placeholder="your@email.com"
				/>
			</div>

			<div>
				<label htmlFor="phone" className="mb-2 block text-sm font-medium text-dark-text-primary">
					Phone Number
				</label>
				<input
					type="tel"
					id="phone"
					name="phone"
					className="input-dark w-full rounded-md px-4 py-2"
					placeholder="Your phone number"
				/>
			</div>

			<div>
				<label htmlFor="orderNumber" className="mb-2 block text-sm font-medium text-dark-text-primary">
					Order Number (if applicable)
				</label>
				<input
					type="text"
					id="orderNumber"
					name="orderNumber"
					className="input-dark w-full rounded-md px-4 py-2"
					placeholder="Order number"
				/>
			</div>

			<div>
				<label htmlFor="enquiry" className="mb-2 block text-sm font-medium text-dark-text-primary">
					Details of Your Enquiry *
				</label>
				<textarea
					id="enquiry"
					name="enquiry"
					required
					rows={6}
					className="input-dark w-full rounded-md px-4 py-2"
					placeholder="Please provide details of your enquiry..."
				/>
			</div>

			{submitStatus && (
				<div
					className={`rounded-md p-4 ${
						submitStatus.type === "success"
							? "bg-green-900/20 text-green-400 border border-green-500/30"
							: "bg-red-900/20 text-red-400 border border-red-500/30"
					}`}
				>
					{submitStatus.message}
				</div>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className={`btn-primary w-full ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
			>
				{isSubmitting ? "Sending..." : "Send Enquiry"}
			</button>
		</form>
	);
}