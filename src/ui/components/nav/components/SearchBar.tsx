import { redirect } from "next/navigation";
import { SearchIcon } from "lucide-react";

export const SearchBar = () => {
	async function onSubmit(formData: FormData) {
		"use server";
		const search = formData.get("search") as string;
		if (search && search.trim().length > 0) {
			redirect(`/search?query=${encodeURIComponent(search)}`);
		}
	}

	return (
		<form
			action={onSubmit}
			className="group relative my-2 flex w-full items-center justify-items-center text-sm lg:w-80"
		>
			<label className="w-full">
				<span className="sr-only">Search by product or brand</span>
				<input
					type="text"
					name="search"
					placeholder="Search by product or brand"
					autoComplete="on"
					required
					className="input-dark h-10 w-full rounded-md px-4 py-2 pr-10 text-sm placeholder:text-dark-text-secondary"
				/>
			</label>
			<div className="absolute inset-y-0 right-0">
				<button
					type="submit"
					className="inline-flex aspect-square w-10 items-center justify-center text-dark-text-secondary hover:text-dark-text-primary focus:text-dark-text-primary group-invalid:pointer-events-none group-invalid:opacity-80"
				>
					<span className="sr-only">search</span>
					<SearchIcon aria-hidden className="h-5 w-5" />
				</button>
			</div>
		</form>
	);
};
