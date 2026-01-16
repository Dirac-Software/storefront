"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { GetPackAllocationQuery } from "@/gql/graphql";
import { fetchPackAllocation } from "./actions";
import { formatMoney } from "@/lib/utils";

type PackAllocation = NonNullable<GetPackAllocationQuery["getPackAllocation"]>;

type PackSizeSelectorProps = {
	productId: string;
	channelSlug: string;
	checkoutId?: string;
	minimumOrderQuantity?: number;
	totalAvailableQuantity?: number;
	onPackSizeChange?: (packSize: number) => void;
};

export function PackSizeSelector({
	productId,
	channelSlug,
	checkoutId,
	minimumOrderQuantity = 0,
	totalAvailableQuantity: _totalAvailableQuantity = 0,
	onPackSizeChange,
}: PackSizeSelectorProps) {
	const [packSize, setPackSize] = useState(Math.max(0, minimumOrderQuantity));
	const [allocation, setAllocation] = useState<PackAllocation | null>(null);
	const [loading, setLoading] = useState(false);
	const { pending } = useFormStatus();

	// Update packSize when minimumOrderQuantity changes
	useEffect(() => {
		if (minimumOrderQuantity > 0 && packSize === 0) {
			setPackSize(minimumOrderQuantity);
		}
	}, [minimumOrderQuantity, packSize]);

	// Fetch pack allocation whenever packSize changes
	useEffect(() => {
		if (packSize <= 0) {
			setAllocation(null);
			return;
		}

		const loadAllocation = async () => {
			setLoading(true);
			try {
				const result = await fetchPackAllocation({
					productId,
					packSize,
					channelSlug,
					checkoutId,
				});

				setAllocation(result ?? null);
			} catch (error) {
				console.error("Failed to fetch pack allocation:", error);
			} finally {
				setLoading(false);
			}
		};

		loadAllocation();
	}, [packSize, productId, channelSlug, checkoutId]);

	// Notify parent of pack size changes
	useEffect(() => {
		onPackSizeChange?.(packSize);
	}, [packSize, onPackSizeChange]);

	const handleIncrement = () => {
		setPackSize((prev) => prev + 1);
	};

	const handleDecrement = () => {
		setPackSize((prev) => Math.max(0, prev - 1));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value) && value >= 0) {
			setPackSize(value);
		}
	};

	// Calculate total pack price
	const totalPackPrice =
		allocation?.allocation.reduce((sum, item) => {
			const price = item.variant.pricing?.price?.net.amount || 0;
			return sum + price * item.quantity;
		}, 0) || 0;

	const currency = allocation?.allocation[0]?.variant.pricing?.price?.net.currency || "USD";

	// Backend now handles all validation including effective minimum
	const isDisabled = pending || !allocation?.canAdd;

	// Calculate total units
	const totalUnits = allocation?.allocation.reduce((sum, item) => sum + item.quantity, 0) || 0;

	// Check if requested quantity exceeds available stock
	const exceedsStock = packSize > 0 && totalUnits > 0 && packSize > totalUnits;

	return (
		<div className="mt-6 space-y-4">
			{/* What you will get - Table Format */}
			{allocation && allocation.allocation.length > 0 && (
				<div className="card-dark p-4">
					<h3 className="mb-3 text-sm font-semibold text-dark-text-primary">What you will get:</h3>
					<div className={`${loading ? "opacity-50" : ""}`}>
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-dark-border">
									<th className="px-3 py-2 text-left font-medium text-dark-text-secondary">Sizes</th>
									{allocation.allocation.map((item) => (
										<th
											key={item.variant.id}
											className="px-3 py-2 text-center font-medium text-dark-text-secondary"
										>
											{item.variant.name}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="px-3 py-2 text-left font-medium text-dark-text-secondary">Units</td>
									{allocation.allocation.map((item) => (
										<td
											key={item.variant.id}
											className="px-3 py-2 text-center font-semibold text-dark-text-primary"
										>
											{item.quantity}
										</td>
									))}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Pack Size Selector Card */}
			<div className="card-dark space-y-4 p-4">
				{/* Quantity Input */}
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium text-dark-text-primary">Quantity:</span>
					<div className="flex items-center space-x-3">
						<button
							type="button"
							onClick={handleDecrement}
							disabled={packSize <= 0 || pending}
							className="flex h-10 w-10 items-center justify-center rounded-md border border-dark-border bg-dark-card text-dark-text-primary hover:bg-dark-card-hover disabled:cursor-not-allowed disabled:opacity-50"
							aria-label="Decrease quantity"
						>
							−
						</button>
						<input
							type="number"
							id="pack-size"
							name="packSize"
							value={packSize}
							onChange={handleInputChange}
							min="0"
							disabled={pending}
							className={`input-dark h-10 w-20 rounded-md text-center text-base ${
								exceedsStock ? "border-2 border-orange-500 bg-orange-50" : ""
							}`}
						/>
						<button
							type="button"
							onClick={handleIncrement}
							disabled={pending}
							className="flex h-10 w-10 items-center justify-center rounded-md border border-dark-border bg-dark-card text-dark-text-primary hover:bg-dark-card-hover disabled:cursor-not-allowed disabled:opacity-50"
							aria-label="Increase quantity"
						>
							+
						</button>
					</div>
				</div>

				{/* Stock Exceeded Warning */}
				{exceedsStock && (
					<div className="rounded-md border border-orange-500 bg-orange-50 p-3">
						<div className="flex items-start gap-2">
							<svg
								className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<div className="flex-1 text-sm">
								<p className="font-semibold text-orange-800">Requested quantity exceeds available stock</p>
								<p className="mt-1 text-orange-700">
									You requested {packSize} units, but only {totalUnits} units are available. We&apos;ll add{" "}
									{totalUnits} units to your cart.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Units Total */}
				{totalUnits > 0 && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-dark-text-secondary">Units total:</span>
						<span className={`font-semibold ${exceedsStock ? "text-orange-600" : "text-dark-text-primary"}`}>
							{totalUnits}
						</span>
					</div>
				)}

				{/* Order Total */}
				{allocation && totalPackPrice > 0 && (
					<div className="flex items-center justify-between border-t border-dark-border pt-3">
						<span className="text-sm text-dark-text-secondary">Order total:</span>
						<span className="text-lg font-bold text-blue-600">{formatMoney(totalPackPrice, currency)}</span>
					</div>
				)}

				{/* Loading State */}
				{loading && <p className="text-sm text-dark-text-secondary">Calculating allocation...</p>}

				{/* Backend Validation Message */}
				{allocation?.message && <div className="text-sm font-medium text-red-400">{allocation.message}</div>}

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isDisabled}
					aria-disabled={isDisabled}
					aria-busy={pending}
					onClick={(e) => isDisabled && e.preventDefault()}
					className="btn-primary h-12 w-full"
				>
					{pending ? (
						<div className="inline-flex items-center">
							<svg
								className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<span>Adding pack...</span>
						</div>
					) : (
						<span>Add to cart</span>
					)}
				</button>
			</div>
		</div>
	);
}
