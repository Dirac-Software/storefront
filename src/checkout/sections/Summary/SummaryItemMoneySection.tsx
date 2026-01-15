import { type OrderLineFragment } from "@/checkout/graphql";
import { SummaryItemMoneyInfo } from "@/checkout/sections/Summary/SummaryItemMoneyInfo";

interface LineItemQuantitySelectorProps {
	line: OrderLineFragment;
}

export const SummaryItemMoneySection: React.FC<LineItemQuantitySelectorProps> = ({ line }) => {
	return (
		<div className="flex flex-col items-end">
			<p>Qty: {line.quantity}</p>
			<SummaryItemMoneyInfo
				unitPrice={{ gross: line.unitPrice.gross, net: line.unitPrice.gross }}
				undiscountedUnitPrice={line.undiscountedUnitPrice.gross}
				quantity={line.quantity}
			/>
		</div>
	);
};
