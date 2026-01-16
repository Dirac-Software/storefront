import type { FC } from "react";
import clsx from "clsx";
import { Money } from "@/checkout/components";
import { type Money as MoneyType } from "@/checkout/graphql";
import { getFormattedMoney } from "@/checkout/lib/utils/money";
import { type GrossMoney } from "@/checkout/lib/globalTypes";

interface SummaryItemMoneyInfoProps {
	unitPrice: GrossMoney;
	undiscountedUnitPrice: MoneyType;
	totalPrice: GrossMoney;
	quantity: number;
}

export const SummaryItemMoneyInfo: FC<SummaryItemMoneyInfoProps> = ({
	unitPrice,
	quantity,
	undiscountedUnitPrice,
	totalPrice,
}) => {
	const multiplePieces = quantity > 1;
	const piecePrice = unitPrice.net || unitPrice.gross;
	const totalPriceNet = totalPrice.net || totalPrice.gross;
	const totalPriceGross = totalPrice.gross;

	return (
		<div className="flex flex-col items-end justify-end">
			<div className="flex flex-row flex-wrap justify-end gap-x-2">
				<Money ariaLabel="total price (incl. VAT)" money={totalPriceGross} />
			</div>

			{multiplePieces && (
				<p aria-label="single piece price" color="secondary" className="text-end text-xs">
					{getFormattedMoney(piecePrice)} each
				</p>
			)}
		</div>
	);
};
