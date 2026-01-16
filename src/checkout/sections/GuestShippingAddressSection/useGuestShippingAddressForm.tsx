import { omit } from "lodash-es";
import { useMemo } from "react";
import { useCheckoutShippingAddressUpdateMutation } from "@/checkout/graphql";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import {
	getAddressFormDataFromAddress,
	getAddressInputData,
	getAddressValidationRulesVariables,
} from "@/checkout/components/AddressForm/utils";
import { useCheckoutFormValidationTrigger } from "@/checkout/hooks/useCheckoutFormValidationTrigger";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import {
	type AutoSaveAddressFormData,
	useAutoSaveAddressForm,
} from "@/checkout/hooks/useAutoSaveAddressForm";
import { useSetCheckoutFormValidationState } from "@/checkout/hooks/useSetCheckoutFormValidationState";

export const useGuestShippingAddressForm = () => {
	const {
		checkout: { shippingAddress },
	} = useCheckout();

	const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();
	const { setCheckoutFormValidationState } = useSetCheckoutFormValidationState("shippingAddress");
	const { showCustomErrors } = useAlerts("checkoutShippingUpdate");

	const onSubmit = useFormSubmit<AutoSaveAddressFormData, typeof checkoutShippingAddressUpdate>(
		useMemo(
			() => ({
				scope: "checkoutShippingUpdate",
				onSubmit: checkoutShippingAddressUpdate,
				hideAlerts: true,
				parse: ({ languageCode, checkoutId, ...rest }) => ({
					languageCode,
					checkoutId,
					shippingAddress: getAddressInputData(omit(rest, "channel")),
					validationRules: getAddressValidationRulesVariables({ autoSave: true }),
				}),
				onSuccess: ({ data, formHelpers }) => {
					void setCheckoutFormValidationState({
						...formHelpers,
						values: getAddressFormDataFromAddress(data.checkout?.shippingAddress),
					});
				},
				onError: ({ errors }) => {
					// Group errors by code to avoid showing duplicates
					const insufficientStockErrors = errors.filter((e) => e.code === "INSUFFICIENT_STOCK");
					const otherErrors = errors.filter((e) => e.code !== "INSUFFICIENT_STOCK");

					if (insufficientStockErrors.length > 0) {
						showCustomErrors([
							{
								message:
									"Some items in your cart are out of stock. Please review your cart and remove unavailable items.",
							},
						]);
					}

					// Show API error messages with field names
					otherErrors.forEach((error) => {
						const fieldName = error.field
							? error.field.charAt(0).toUpperCase() + error.field.slice(1).replace(/([A-Z])/g, " $1")
							: "";
						const message = fieldName
							? `${fieldName}: ${error.message || "An error occurred"}`
							: error.message || "An error occurred";
						showCustomErrors([{ message }]);
					});
				},
			}),
			[checkoutShippingAddressUpdate, setCheckoutFormValidationState, showCustomErrors],
		),
	);

	const form = useAutoSaveAddressForm({
		onSubmit,
		initialValues: getAddressFormDataFromAddress(shippingAddress),
		scope: "checkoutShippingUpdate",
	});

	useCheckoutFormValidationTrigger({
		form,
		scope: "shippingAddress",
	});

	return form;
};
