import { isEqual, omit, pick, reduce, uniq } from "lodash-es";
import {
	type OptionalAddress,
	type AddressField,
	type AddressFormData,
	type ApiAddressField,
} from "../../components/AddressForm/types";
import { getCountryName } from "@/checkout/lib/utils/locale";
import {
	type AddressFragment,
	type AddressInput,
	type CheckoutAddressValidationRules,
	type CountryCode,
	type CountryDisplay,
} from "@/checkout/graphql";
import { type MightNotExist } from "@/checkout/lib/globalTypes";

// EU country codes
export const EU_COUNTRIES: CountryCode[] = [
	"AT", // Austria
	"BE", // Belgium
	"BG", // Bulgaria
	"HR", // Croatia
	"CY", // Cyprus
	"CZ", // Czech Republic
	"DK", // Denmark
	"EE", // Estonia
	"FI", // Finland
	"FR", // France
	"DE", // Germany
	"GR", // Greece
	"HU", // Hungary
	"IE", // Ireland
	"IT", // Italy
	"LV", // Latvia
	"LT", // Lithuania
	"LU", // Luxembourg
	"MT", // Malta
	"NL", // Netherlands
	"PL", // Poland
	"PT", // Portugal
	"RO", // Romania
	"SK", // Slovakia
	"SI", // Slovenia
	"ES", // Spain
	"SE", // Sweden
];

export const getEmptyAddressFormData = (): AddressFormData => ({
	firstName: "",
	lastName: "",
	streetAddress1: "",
	streetAddress2: "",
	companyName: "",
	city: "",
	cityArea: "",
	countryArea: "",
	postalCode: "",
	phone: "",
	countryCode: "US",
	vatNumber: "",
});

export const getEmptyAddress = (): AddressFragment => {
	const { countryCode, ...emptyAddressRest } = getEmptyAddressFormData();

	return {
		...emptyAddressRest,
		id: "",
		country: {
			code: countryCode,
			country: getCountryName(countryCode),
		},
	};
};

export const getAllAddressFieldKeys = () =>
	Object.keys(getEmptyAddressFormData()).filter((key) => key !== "vatNumber");

export const getAddressInputData = ({
	countryCode,
	country,
	vatNumber,
	...rest
}: Partial<
	AddressFormData & {
		countryCode?: CountryCode;
		country: CountryDisplay;
	}
>): AddressInput => {
	const addressData: AddressInput = {
		...pick(rest, getAllAddressFieldKeys()),
		country: countryCode || (country?.code as CountryCode),
	};

	// Add VAT number to metadata if provided (strip __typename if present)
	if (vatNumber) {
		addressData.metadata = [{ key: "vat_number", value: vatNumber }];
	}

	return addressData;
};

export const getAddressInputDataFromAddress = (
	address: OptionalAddress | Partial<AddressFragment>,
): AddressInput => {
	if (!address) {
		return {};
	}

	const { country, phone, ...rest } = address;

	const addressInput: AddressInput = {
		...pick(rest, getAllAddressFieldKeys()),
		country: country?.code as CountryCode,
		// cause in api phone can be null
		phone: phone || "",
	};

	// Preserve metadata including VAT number if it exists (strip __typename)
	if ((address as any).metadata) {
		addressInput.metadata = (address as any).metadata.map((item: any) => ({
			key: item.key,
			value: item.value,
		}));
	}

	return addressInput;
};

export const getAddressFormDataFromAddress = (address: OptionalAddress): AddressFormData => {
	if (!address) {
		return {
			...getEmptyAddressFormData(),
			countryCode: "US",
		};
	}

	const { country, ...rest } = address;

	const parsedAddressBase = reduce(rest, (result, val, key) => ({ ...result, [key]: val || "" }), {}) as Omit<
		AddressFormData,
		"countryCode"
	>;

	// Extract VAT number from metadata if it exists
	const vatNumber = (address as any).metadata?.find((item: any) => item.key === "vat_number")?.value || "";

	return {
		...pick(
			{
				...parsedAddressBase,
				countryCode: country.code as CountryCode,
			},
			getAllAddressFieldKeys(),
		),
		vatNumber,
	} as AddressFormData;
};

// checks for address related data and id
export const isMatchingAddress = (
	address?: Partial<AddressFragment> | null,
	addressToMatch?: Partial<AddressFragment> | null,
) => {
	const isTheSameAddressById =
		typeof address?.id === "string" &&
		typeof addressToMatch?.id === "string" &&
		address.id === addressToMatch.id;

	if (isTheSameAddressById) {
		return true;
	}

	return isMatchingAddressData(address, addressToMatch);
};

// checks only for address related data
export const isMatchingAddressData = (
	address?: Partial<AddressFragment> | null,
	addressToMatch?: Partial<AddressFragment> | null,
) => isEqual(pick(address, getAllAddressFieldKeys()), pick(addressToMatch, getAllAddressFieldKeys()));

export const getByMatchingAddress =
	(addressToMatch: MightNotExist<Partial<AddressFragment>>) => (address: AddressFragment) =>
		isMatchingAddress(address, addressToMatch);

export const isMatchingAddressFormData = (
	address?: Partial<AddressFormData> | null,
	addressToMatch?: Partial<AddressFormData> | null,
) => {
	const propsToOmit = ["id", "autoSave", "__typename"];

	return isEqual(omit(address, propsToOmit), omit(addressToMatch, propsToOmit));
};

export const getAddressValidationRulesVariables = (
	{ autoSave }: { autoSave: boolean } = { autoSave: false },
): CheckoutAddressValidationRules =>
	autoSave
		? {
				checkRequiredFields: false,
			}
		: {};

export const addressFieldsOrder: AddressField[] = [
	"firstName",
	"lastName",
	"companyName",
	"streetAddress1",
	"streetAddress2",
	"city",
	"countryCode",
	"postalCode",
	"cityArea",
	"countryArea",
	"phone",
];

// api doesn't order the fields but we want to
export const getOrderedAddressFields = (addressFields: AddressField[] = []): AddressField[] => {
	const filteredAddressFields = getFilteredAddressFields(addressFields);

	return addressFieldsOrder.filter((orderedAddressField) =>
		filteredAddressFields.includes(orderedAddressField),
	);
};

export const getRequiredAddressFields = (requiredFields: AddressField[] = []): AddressField[] => [
	...requiredFields,
	"firstName",
	"lastName",
];

// api doesn't approve of "name" so we replace it with "firstName"
// and "lastName"
export const getFilteredAddressFields = (addressFields: ApiAddressField[]): AddressField[] => {
	const filteredAddressFields = addressFields.filter(
		(addressField: ApiAddressField) => addressField !== "name",
	) as AddressField[];

	return uniq([...filteredAddressFields, "firstName", "lastName", "phone"]);
};
