import { useEffect } from "react";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { type PaymentStatus } from "@/checkout/sections/PaymentSection/types";
import { usePaymentGatewaysInitialize } from "@/checkout/sections/PaymentSection/usePaymentGatewaysInitialize";
import { usePaymentStatus } from "@/checkout/sections/PaymentSection/utils";
import { getQueryParams } from "@/checkout/lib/utils/url";

const paidStatuses: PaymentStatus[] = ["overpaid", "paidInFull", "authorized"];

export const usePayments = () => {
	const { checkout } = useCheckout();
	const paymentStatus = usePaymentStatus(checkout);

	const { fetching, availablePaymentGateways } = usePaymentGatewaysInitialize();

	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

	useEffect(() => {
		const { processingPayment } = getQueryParams();

		// the checkout was already paid earlier, complete
		if (processingPayment) {
			return;
		}

		// Don't attempt to complete if billing address is not set
		if (!checkout.billingAddress) {
			return;
		}

		if (!completingCheckout && paidStatuses.includes(paymentStatus)) {
			void onCheckoutComplete();
		}
	}, [completingCheckout, onCheckoutComplete, paymentStatus, checkout.billingAddress]);

	return { fetching, availablePaymentGateways };
};
