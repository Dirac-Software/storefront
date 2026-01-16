import { type CheckoutLineFragment } from "@/checkout/graphql";

import { Skeleton } from "@/checkout/components";
import { SummaryItemMoneyInfo } from "@/checkout/sections/Summary/SummaryItemMoneyInfo";
import { useSummaryItemForm } from "@/checkout/sections/Summary/useSummaryItemForm";

interface SummaryItemMoneyEditableSectionProps {
	line: CheckoutLineFragment;
}

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line }) => {
	const { form, onLineDelete: _onLineDelete } = useSummaryItemForm({ line });

	const {
		handleBlur: _handleBlur,
		handleChange: _handleChange,
		setFieldValue: _setFieldValue,
		handleSubmit: _handleSubmit,
		isSubmitting,
		values: { quantity: _quantityString },
	} = form;

	return (
		<div className="flex flex-col items-end gap-2">
			<div className="text-sm text-neutral-500">
				Qty: <span className="font-semibold text-neutral-900">{line.quantity}</span>
			</div>
			{isSubmitting ? (
				<div className="flex max-w-[6ch] flex-col">
					<Skeleton />
					<Skeleton />
				</div>
			) : (
				<SummaryItemMoneyInfo
					unitPrice={{ gross: line.unitPrice.gross, net: line.unitPrice.net }}
					undiscountedUnitPrice={line.undiscountedUnitPrice}
					totalPrice={{ gross: line.totalPrice.gross, net: line.totalPrice.net }}
					quantity={line.quantity}
				/>
			)}
		</div>
	);
};
