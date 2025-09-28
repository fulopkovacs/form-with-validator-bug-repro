import {
	createFormHook,
	createFormHookContexts,
	formOptions,
} from "@tanstack/react-form";

const { fieldContext, useFieldContext, formContext, useFormContext } =
	createFormHookContexts();

function TextField({ label }: { label: string }) {
	const field = useFieldContext<string>();
	return (
		<label>
			<span>{label}</span>
			<input
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
		</label>
	);
}

function SubscribeButton({ label }: { label: string }) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<button disabled={isSubmitting} onClick={() => form.handleSubmit()}>
					{label}
				</button>
			)}
		</form.Subscribe>
	);
}

const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});

// /src/features/people/shared-form.ts, to be used across `people` features
const formOpts = formOptions({
	defaultValues: {
		firstName: "John",
		lastName: "Doe",
	},
});

// /src/features/people/nested-form.ts, to be used in the `people` page
const ChildForm = withForm({
	...formOpts,
	// Optional, but adds props to the `render` function outside of `form`
	props: {
		title: "Child Form",
	},
	render: ({ form, title }) => {
		return (
			<div className="flex flex-row gap-2">
				<p>{title}</p>
				<form.AppField
					name="firstName"
					children={(field) => <field.TextField label="First Name" />}
				/>
				<form.AppForm>
					<form.SubscribeButton label="Submit" />
				</form.AppForm>
			</div>
		);
	},
});

// /src/features/people/page.ts
export const ReproForm = () => {
	const form = useAppForm({
		...formOpts,
		validators: {
			onSubmit: (p) => {
				const name = "Joe";
				console.log("Parent form submitted");
				if (p.value.firstName.toLowerCase().trim() === name.toLowerCase()) {
					return `${name} is not allowed to log in`;
				}
			},
			onSubmitAsync: async (p) => {
				const name = "Jack";
				if (p.value.firstName.toLowerCase().trim() === name.toLowerCase()) {
					return `${name} is not allowed to log in`;
				}
			},
		},
		onSubmit: async (p) => {
			const { firstName, lastName } = p.value;
			console.info("form submitted with the following values: ", {
				firstName,
				lastName,
			});
		},
	});

	return (
		<>
			<h1>Form</h1>
			{/* ⚠️ TypeScript complains about the type of `form`, but the code works */}
			<ChildForm form={form} title={"Testing"} />
			<form.Subscribe selector={(state) => state.errors}>
				{(errors) =>
					errors.map((e) => (
						<p
							style={{
								color: "red",
							}}
							key={e}
						>
							{e}
						</p>
					))
				}
			</form.Subscribe>
		</>
	);
};
