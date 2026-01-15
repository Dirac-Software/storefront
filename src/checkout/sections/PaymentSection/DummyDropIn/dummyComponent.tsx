"use client";

import { dummyGatewayId } from "./types";
import { Button } from "@/checkout/components";
import { useTransactionInitializeMutation } from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";

// Basic implementation of the test gateway:
// https://github.com/saleor/dummy-payment-app/

export const DummyComponent = () => {
	const { showCustomErrors } = useAlerts();

	const { checkout } = useCheckout();
	const [transactionInitializeState, transactionInitialize] = useTransactionInitializeMutation();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();
	const { updateState } = useCheckoutUpdateState();
	const isInProgress = completingCheckout || transactionInitializeState.fetching;

	const onInitalizeClick = () => {
		if (!checkout.email) {
			showCustomErrors([
				{ message: "Email is required to complete the order. Please provide your email address." },
			]);
			return;
		}

		// Check if billing address update is still in progress
		if (updateState.checkoutBillingUpdate === "loading") {
			showCustomErrors([
				{ message: "Please wait for billing address to be saved before completing payment." },
			]);
			return;
		}

		// Billing address must be set in checkout before payment
		if (!checkout.billingAddress) {
			showCustomErrors([{ message: "Please wait for billing address to be saved, then try again." }]);
			return;
		}

		void transactionInitialize({
			checkoutId: checkout.id,
			paymentGateway: {
				id: dummyGatewayId,
				data: {
					event: {
						includePspReference: true,
						type: "CHARGE_SUCCESS",
					},
				},
			},
		})
			.catch((err) => {
				console.error("There was a problem with Dummy Payment Gateway:", err);
			})
			.then((_) => {
				return onCheckoutComplete();
			})
			.then((res) => {
				if (res?.apiErrors) {
					res.apiErrors.forEach((error) => {
						showCustomErrors([{ message: error.message }]);
					});
				}
			});
	};

	const isBillingUpdateInProgress = updateState.checkoutBillingUpdate === "loading";
	const isBillingAddressMissing = !checkout.billingAddress;

	if (isInProgress) {
		return <Button variant="primary" disabled={true} label="Processing payment..." />;
	}

	if (isBillingUpdateInProgress) {
		return <Button variant="primary" disabled={true} label="Saving billing address..." />;
	}

	if (isBillingAddressMissing) {
		return <Button variant="primary" disabled={true} label="Waiting for billing address..." />;
	}

	return <Button variant="primary" onClick={onInitalizeClick} label="Make payment and create order" />;
};
