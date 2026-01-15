"use client";

import { useTransition } from "react";
import { deletePack } from "./actions";

export function DeletePackButton({
	checkoutId,
	packId,
	lineIds,
}: {
	checkoutId: string;
	packId: string;
	lineIds: string[];
}) {
	const [pending, startTransition] = useTransition();

	return (
		<button
			className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={pending}
			onClick={() => {
				startTransition(async () => {
					await deletePack(checkoutId, lineIds);
				});
			}}
		>
			{pending ? "Removing..." : "Delete Pack"}
		</button>
	);
}
