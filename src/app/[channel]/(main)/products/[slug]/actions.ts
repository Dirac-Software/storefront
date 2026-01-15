"use server";

import { executeGraphQL } from "@/lib/graphql";
import { GetPackAllocationDocument } from "@/gql/graphql";

export async function fetchPackAllocation({
	productId,
	packSize,
	channelSlug,
	checkoutId,
}: {
	productId: string;
	packSize: number;
	channelSlug: string;
	checkoutId?: string;
}) {
	const { getPackAllocation } = await executeGraphQL(GetPackAllocationDocument, {
		variables: {
			productId,
			packSize,
			channelSlug,
			checkoutId,
		},
		cache: "no-cache",
	});

	return getPackAllocation;
}
