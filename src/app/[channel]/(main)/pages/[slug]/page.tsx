import { notFound } from "next/navigation";
import { type Metadata } from "next";
import edjsHTML from "editorjs-html";
import xss from "xss";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const parser = edjsHTML();

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
	const params = await props.params;
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	return {
		title: `${page?.seoTitle || page?.title || "Page"} · Sports Wholesale`,
		description: page?.seoDescription || page?.seoTitle || page?.title,
	};
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	if (!page) {
		notFound();
	}

	const { title, content } = page;

	// Check if content is EditorJS JSON or plain HTML
	let contentHtml: string | string[] | null = null;

	if (content) {
		try {
			// Try parsing as EditorJS JSON
			const parsed = JSON.parse(content);
			if (parsed.blocks || parsed.time) {
				// It's EditorJS format
				contentHtml = parser.parse(parsed);
			} else {
				// It's plain HTML
				contentHtml = content;
			}
		} catch {
			// If JSON parsing fails, treat as plain HTML
			contentHtml = content;
		}
	}

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="mb-6 text-3xl font-semibold">{title}</h1>
			{contentHtml && (
				<div className="prose prose-neutral max-w-none">
					{Array.isArray(contentHtml) ? (
						contentHtml.map((htmlBlock, index) => (
							<div key={index} dangerouslySetInnerHTML={{ __html: xss(htmlBlock) }} />
						))
					) : (
						<div dangerouslySetInnerHTML={{ __html: xss(contentHtml) }} />
					)}
				</div>
			)}
		</div>
	);
}
