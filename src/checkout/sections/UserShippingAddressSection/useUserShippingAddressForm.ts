import { useMemo } from "react";
import {
	getAddressInputDataFromAddress,
	getAddressValidationRulesVariables,
	getByMatchingAddress,
	isMatchingAddress,
} from "@/checkout/components/AddressForm/utils";
import { type AddressFragment, useCheckoutShippingAddressUpdateMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { useUser } from "@/checkout/hooks/useUser";
import { getById } from "@/checkout/lib/utils/common";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import {
	type AddressListFormData,
	useAddressListForm,
} from "@/checkout/sections/AddressList/useAddressListForm";

export const useUserShippingAddressForm = () => {
	const { checkout } = useCheckout();
	const { shippingAddress } = checkout;
	const { user } = useUser();
	const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();
	const { showCustomErrors } = useAlerts("checkoutShippingUpdate");

	const onSubmit = useFormSubmit<AddressListFormData, typeof checkoutShippingAddressUpdate>(
		useMemo(
			() => ({
				scope: "checkoutShippingUpdate",
				onSubmit: checkoutShippingAddressUpdate,
				hideAlerts: true,
				shouldAbort: ({ formData: { addressList, selectedAddressId } }) =>
					!selectedAddressId ||
					isMatchingAddress(shippingAddress, addressList.find(getById(selectedAddressId))),
				parse: ({ languageCode, checkoutId, selectedAddressId, addressList }) => ({
					languageCode,
					checkoutId,
					validationRules: getAddressValidationRulesVariables(),
					shippingAddress: getAddressInputDataFromAddress(
						addressList.find(getByMatchingAddress({ id: selectedAddressId })) as AddressFragment,
					),
				}),
				onSuccess: ({ formHelpers: { resetForm }, formData }) => resetForm({ values: formData }),
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
			[checkoutShippingAddressUpdate, shippingAddress, showCustomErrors],
		),
	);

	const { form, userAddressActions } = useAddressListForm({
		onSubmit,
		defaultAddress: user?.defaultShippingAddress,
		checkoutAddress: shippingAddress,
	});

	return { form, userAddressActions };
};
