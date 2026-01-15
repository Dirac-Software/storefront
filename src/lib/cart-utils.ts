type CheckoutLine = {
	id: string;
	quantity: number;
	metadata?: Array<{ key: string; value: string }> | null;
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	variant: {
		id: string;
		name: string;
		product: {
			id: string;
			name: string;
			slug: string;
			thumbnail?: {
				url: string;
				alt?: string | null;
			} | null;
			category?: {
				name: string;
			} | null;
		};
		pricing?: {
			price?: {
				gross: {
					amount: number;
					currency: string;
				};
			} | null;
		} | null;
	};
};

export type PackGroup = {
	packId: string;
	packSize: string;
	productId: string;
	productName: string;
	productSlug: string;
	productThumbnail?: { url: string; alt?: string | null } | null;
	lines: CheckoutLine[];
	totalPrice: {
		amount: number;
		currency: string;
	};
};

export type CartItem =
	| {
			type: "pack";
			pack: PackGroup;
	  }
	| {
			type: "single";
			line: CheckoutLine;
	  };

function getMetadataValue(
	metadata: Array<{ key: string; value: string }> | null | undefined,
	key: string,
): string | null {
	if (!metadata) return null;
	const item = metadata.find((m) => m.key === key);
	return item?.value ?? null;
}

export function groupCartItems(lines: CheckoutLine[]): CartItem[] {
	const packMap = new Map<string, CheckoutLine[]>();
	const singleItems: CheckoutLine[] = [];

	// Group lines by pack_id
	for (const line of lines) {
		const packId = getMetadataValue(line.metadata, "pack_id");

		if (packId) {
			if (!packMap.has(packId)) {
				packMap.set(packId, []);
			}
			packMap.get(packId)!.push(line);
		} else {
			singleItems.push(line);
		}
	}

	const result: CartItem[] = [];

	// Add pack groups
	for (const [packId, packLines] of packMap.entries()) {
		if (packLines.length === 0) continue;

		const firstLine = packLines[0];
		const packSize = getMetadataValue(firstLine.metadata, "pack_size") ?? "Unknown";

		// Calculate total price for the pack
		const totalAmount = packLines.reduce((sum, line) => sum + line.totalPrice.gross.amount, 0);
		const currency = firstLine.totalPrice.gross.currency;

		result.push({
			type: "pack",
			pack: {
				packId,
				packSize,
				productId: firstLine.variant.product.id,
				productName: firstLine.variant.product.name,
				productSlug: firstLine.variant.product.slug,
				productThumbnail: firstLine.variant.product.thumbnail,
				lines: packLines,
				totalPrice: {
					amount: totalAmount,
					currency,
				},
			},
		});
	}

	// Add single items
	for (const line of singleItems) {
		result.push({
			type: "single",
			line,
		});
	}

	return result;
}
