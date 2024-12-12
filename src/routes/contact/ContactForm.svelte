<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { Turnstile } from 'svelte-turnstile';
	//import type { Infer } from 'sveltekit-superforms/';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ContactFormSchema } from '$lib/schemas';
	const serviceOptions = ['Webpage', 'App', 'Integration'] as const;
	export let data: SuperValidated<ContactFormSchema>;
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	export let wasSubmitted = false;
    export let formError = '';
	export let submission_status = '';

	const { form, message, errors, constraints, enhance } = superForm(data, {
		//        validators: ContactFormSchema,
		resetForm: false,
		taintedMessage: null,

		onSubmit: (event: any) => {
			wasSubmitted = true;
			submission_status = 'submitting';
		},
		onUpdated: ({ form }) => {
			if (form.valid) {
				submission_status = 'success';
			} else {
				submission_status = form.message;
				console.log(form);
			}
		},
		delayMs: 500
	});
</script>

<form method="POST" action="?/contact" use:enhance>
	<Turnstile siteKey={PUBLIC_TURNSTILE_SITE_KEY} theme="dark" />
	<div class="myform">
		<label for="fname" class="label-short">
			<span class="label-text">First name</span>
		</label>
		<input
			bind:value={$form.fname}
			data-invalid={$errors.fname}
			type="text"
			name="fname"
			aria-label="first name"
			placeholder=""
			required
			{...$constraints.fname}
		/>
		{#if wasSubmitted && $errors.fname}<span class="invalid">{$errors.fname}</span>{/if}

		<label for="lname" class="label-short">
			<span class="label-text">Last name</span>
		</label>
		<input
			bind:value={$form.lname}
			data-invalid={$errors.lname}
			type="text"
			name="lname"
			aria-label="last name"
			placeholder=""
			required
			autocomplete="off"
			{...$constraints.lname}
		/>
		{#if wasSubmitted && $errors.lname}<span class="invalid">{$errors.lname}</span>{/if}

		<label for="email" class="label-short">
			<span class="label-text">Email</span>
		</label>
		<input
			bind:value={$form.email}
			type="email"
			name="email"
			aria-label="email"
			aria-invalid={$errors.email ? 'true' : undefined}
			placeholder=""
			required
			autocomplete="off"
			{...$constraints.email}
		/>
		{#if wasSubmitted && $errors.email}<span class="invalid">{$errors.email}</span>{/if}

		<label for="type" class="label-short">
			<span class="label-text">Type of service</span>
		</label>

		<select name="serviceTypes" bind:value={$form.serviceTypes}>
			{#each serviceOptions as serviceTypes, i}
				<option value={serviceTypes}>{serviceTypes}</option>
			{/each}
		</select>

		{#if $errors.serviceTypes}<p>{$errors.serviceTypes}</p>{/if}

		<label for="memo" class="label">
			<span class="label-text">How can I help?</span>
		</label>
		<textarea
			bind:value={$form.memo}
			name="memo"
			aria-label="How can I help?"
			placeholder=""
			required
			rows="3"
			autocomplete="off"
			{...$constraints.memo}
		/>
		{#if wasSubmitted && $errors.memo}<span class="invalid">{$errors.memo}</span>{/if}

		<div style="margin-top:10%; margin-left:80%; margin-bottom:-10%">
			<input type="submit" value="Submit" class="btn btn-primary w-full mt-10" />
		</div>
	</div>
</form>

<style>
	.myform {
		display: grid;
		justify-content: start;
		gap: 5%;
		margin: 4% 10% 10% 10%;
		grid-template-columns: 1fr 3fr;
	}

	.label {
		grid-column: 1;
	}
	.label-short {
		grid-column: 1;
	}
	.label-text {
		color: var(--mainThemeLight);
		font: var(--sk-font);
	}
	.label-text-default {
		font-size: 0.8rem;
		font: var(--sk-font-mono);
	}
	.container {
		display: flex;
		justify-content: center;
	}
	.contactbox {
		margin: 5%;
		width: fit-content;
		height: fit-content;
	}
	.invalid {
		color: red;
		font-size: 0.6rem;
	}
	input {
		width: 100%;
	}
	input.btn {
		width: auto;
	}
</style>
