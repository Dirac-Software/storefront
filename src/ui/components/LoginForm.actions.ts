"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerAuthClient } from "@/app/config";

export async function handleLogin(_prevState: { error?: string } | null, formData: FormData) {
	const email = formData.get("email")?.toString();
	const password = formData.get("password")?.toString();

	if (!email || !password) {
		return { error: "Email and password are required" };
	}

	const { data } = await (await getServerAuthClient()).signIn({ email, password }, { cache: "no-store" });

	if (data.tokenCreate.errors.length > 0) {
		const errorMessage = data.tokenCreate.errors.map((error) => error.message).join(", ");
		return { error: errorMessage || "Login failed. Please check your credentials." };
	}

	// Revalidate and redirect after successful login
	revalidatePath("/", "layout");
	redirect("/orders");
}
