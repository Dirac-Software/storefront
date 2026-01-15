import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				dark: {
					bg: "#f5f7fa",
					card: "#ffffff",
					"card-hover": "#f9fafb",
					border: "#e5e7eb",
					text: {
						primary: "#111827",
						secondary: "#6b7280",
						muted: "#9ca3af",
					},
				},
			},
		},
	},
	plugins: [TypographyPlugin, FormPlugin, ContainerQueriesPlugin],
};

export default config;
