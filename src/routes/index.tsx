import { createFileRoute } from "@tanstack/react-router";
import { ReproForm } from "@/components/ReproForm";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div>
			<ReproForm />
		</div>
	);
}
