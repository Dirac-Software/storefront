"use server";

import nodemailer from "nodemailer";

export async function sendContactEmail(formData: FormData) {
	try {
		const businessName = formData.get("businessName") as string;
		const contactName = formData.get("contactName") as string;
		const email = formData.get("email") as string;
		const phone = formData.get("phone") as string;
		const orderNumber = formData.get("orderNumber") as string;
		const enquiry = formData.get("enquiry") as string;

		// Validate required fields
		if (!businessName || !contactName || !email || !enquiry) {
			return { success: false, error: "Please fill in all required fields" };
		}

		// Create email content
		const emailSubject = `New Trade Enquiry from ${businessName}`;
		const emailBody = `
New Trade Enquiry

Business Name: ${businessName}
Contact Name: ${contactName}
Email: ${email}
Phone: ${phone || "Not provided"}
Order Number: ${orderNumber || "Not applicable"}

Enquiry Details:
${enquiry}

---
This enquiry was submitted via the Sports Wholesale contact form.
		`.trim();

		// HTML version of the email
		const emailHtml = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		h2 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
		.field { margin: 10px 0; }
		.label { font-weight: bold; color: #555; }
		.value { color: #000; }
		.enquiry { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }
		.footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 0.9em; }
	</style>
</head>
<body>
	<div class="container">
		<h2>New Trade Enquiry</h2>
		
		<div class="field">
			<span class="label">Business Name:</span>
			<span class="value">${businessName}</span>
		</div>
		
		<div class="field">
			<span class="label">Contact Name:</span>
			<span class="value">${contactName}</span>
		</div>
		
		<div class="field">
			<span class="label">Email:</span>
			<span class="value"><a href="mailto:${email}">${email}</a></span>
		</div>
		
		<div class="field">
			<span class="label">Phone:</span>
			<span class="value">${phone || "Not provided"}</span>
		</div>
		
		<div class="field">
			<span class="label">Order Number:</span>
			<span class="value">${orderNumber || "Not applicable"}</span>
		</div>
		
		<div class="enquiry">
			<h3>Enquiry Details:</h3>
			<p>${enquiry.replace(/\n/g, "<br>")}</p>
		</div>
		
		<div class="footer">
			This enquiry was submitted via the Sports Wholesale contact form.
		</div>
	</div>
</body>
</html>
		`.trim();

		// Check if email configuration is available
		if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
			// Fallback: Log the email for development/testing
			console.log("Email configuration not found. Logging email details:");
			console.log("To: info@sportswholesale.co.uk");
			console.log("Subject:", emailSubject);
			console.log("Body:", emailBody);
			console.log("Reply-To:", email);
			
			// In development, still return success
			return { success: true };
		}

		// Create transporter
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: parseInt(process.env.EMAIL_PORT || "587"),
			secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// Send email
		await transporter.sendMail({
			from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
			to: "info@sportswholesale.co.uk",
			subject: emailSubject,
			text: emailBody,
			html: emailHtml,
			replyTo: email,
		});

		return { success: true };
	} catch (error) {
		console.error("Error processing contact form:", error);
		return { success: false, error: "Failed to process your enquiry. Please try again later." };
	}
}