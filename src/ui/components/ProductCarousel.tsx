"use client";

import { useRef, useState, useEffect } from "react";
import { ProductElement } from "./ProductElement";
import { type ProductListItemFragment } from "@/gql/graphql";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductCarousel({ products }: { products: readonly ProductListItemFragment[] }) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const checkScroll = () => {
		const container = scrollRef.current;
		if (!container) return;

		setCanScrollLeft(container.scrollLeft > 10);
		setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
	};

	useEffect(() => {
		checkScroll();
		const container = scrollRef.current;
		if (container) {
			container.addEventListener("scroll", checkScroll);
			window.addEventListener("resize", checkScroll);
			return () => {
				container.removeEventListener("scroll", checkScroll);
				window.removeEventListener("resize", checkScroll);
			};
		}
	}, []);

	const scroll = (direction: "left" | "right") => {
		const container = scrollRef.current;
		if (!container) return;

		// Scroll by one full container width
		const scrollAmount = container.clientWidth * 0.9;

		if (direction === "left") {
			container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
		} else {
			container.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<div className="group relative">
			{/* Previous Button - Hidden on mobile when can't scroll */}
			{canScrollLeft && (
				<button
					onClick={() => scroll("left")}
					className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-dark-border bg-dark-card text-dark-text-primary shadow-lg transition-all hover:border-blue-500 hover:bg-dark-card-hover md:h-12 md:w-12"
					aria-label="Previous products"
				>
					<ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
				</button>
			)}

			{/* Products Carousel */}
			<div
				ref={scrollRef}
				className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-2 pb-4 md:gap-6 md:px-0 [&_li]:list-none"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{products.map((product) => (
					<div key={product.id} className="w-[260px] flex-shrink-0 snap-start sm:w-[280px] md:w-[300px]">
						<ProductElement product={product} priority={false} loading="lazy" />
					</div>
				))}
			</div>

			{/* Next Button - Hidden on mobile when can't scroll */}
			{canScrollRight && (
				<button
					onClick={() => scroll("right")}
					className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-dark-border bg-dark-card text-dark-text-primary shadow-lg transition-all hover:border-blue-500 hover:bg-dark-card-hover md:h-12 md:w-12"
					aria-label="Next products"
				>
					<ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
				</button>
			)}

			{/* Hide scrollbar CSS */}
			<style jsx>{`
				div::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</div>
	);
}
