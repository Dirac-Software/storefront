import Image from "next/image";
import { formatMoney } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { DeletePackButton } from "./DeletePackButton";
import type { PackGroup as PackGroupType } from "@/lib/cart-utils";

type PackGroupProps = {
	pack: PackGroupType;
	checkoutId: string;
};

export function PackGroup({ pack, checkoutId }: PackGroupProps) {
	return (
		<li className="border-l-4 border-blue-600 bg-dark-card py-4 pl-4 pr-2">
			<div className="flex">
				<div className="aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-dark-border bg-dark-bg sm:h-32 sm:w-32">
					{pack.productThumbnail?.url && (
						<Image
							src={pack.productThumbnail.url}
							alt={pack.productThumbnail.alt ?? ""}
							width={200}
							height={200}
							className="h-full w-full object-contain object-center"
						/>
					)}
				</div>
				<div className="relative flex flex-1 flex-col justify-between p-4 py-2">
					<div className="flex justify-between justify-items-start gap-4">
						<div className="flex-1">
							<div className="mb-2 flex items-center gap-2">
								<h2 className="font-semibold text-dark-text-primary">
									{pack.productName} (Quantity : {pack.packSize})
								</h2>
							</div>
							<div className="ml-6 space-y-1 text-sm text-dark-text-secondary">
								{pack.lines.map((line) => (
									<div key={line.id} className="flex items-center gap-2">
										<span className="text-dark-text-muted">└─</span>
										<span>
											{line.variant.name}: <span className="font-medium">{line.quantity}x</span>
										</span>
										<span className="text-dark-text-muted">
											{formatMoney(line.totalPrice.gross.amount, line.totalPrice.gross.currency)}
										</span>
									</div>
								))}
							</div>
						</div>
						<p className="text-right font-semibold text-blue-600">
							{formatMoney(pack.totalPrice.amount, pack.totalPrice.currency)}
						</p>
					</div>
					<div className="mt-4 flex items-center justify-between">
						<LinkWithChannel
							href={`/products/${pack.productSlug}`}
							className="text-sm text-blue-600 underline transition-colors hover:text-blue-500"
						>
							Change Pack Size
						</LinkWithChannel>
						<DeletePackButton checkoutId={checkoutId} lineIds={pack.lines.map((line) => line.id)} />
					</div>
				</div>
			</div>
		</li>
	);
}
