<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	// @ts-ignore
	import { Turnstile } from 'svelte-turnstile';
	

	interface ContactFormData extends Record<string, unknown> {
		fname: string;
		lname: string;
		email: string;
		serviceTypes: string;
		turnstile?: string;
		memo: string;
	}

	const data = $props<{ form: ContactFormData }>();

	const { form, errors, enhance, constraints, reset } = superForm(data.form, {
		onSubmit: ({ formData, cancel }) => {
			console.log('Form submission starting...');
			if (!turnstileResponse) {
				console.log('No Turnstile response, canceling submission');
				cancel();
				submission_status = 'Please complete the CAPTCHA';
				return;
			}
			console.log('Adding Turnstile response to form data');
			formData.append('cf-turnstile-response', turnstileResponse);
			console.log('Form data being submitted:', Object.fromEntries(formData));
			wasSubmitted = true;
			submission_status = 'submitting';
		},
		onResult: ({ result }) => {
			console.log('Received form submission result:', result);
			if (result.type === 'success') {
				console.log('Form submission successful');
				submission_status = 'success';
				turnstileResponse = '';
				wasSubmitted = false;
				reset();
			} else {
				console.log('Form submission failed:', result);
				submission_status = 'failed';
			}
		},
		onError: (err) => {
			console.log('Form submission error:', err);
			submission_status = 'failed';
			console.error('Form submission error details:', err);
		}
	});

	// Add Turnstile script to head
	let turnstileScript: HTMLScriptElement;
	$effect(() => {
		turnstileScript = document.createElement('script');
		turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		turnstileScript.async = true;
		document.head.appendChild(turnstileScript);

		return () => {
			turnstileScript?.remove();
		};
	});

	let turnstileResponse = $state('');
	let wasSubmitted = $state(false);
	let submission_status = $state('');

	const serviceOptions = ['Webpage', 'App', 'Integration'];

	console.log('in page.svelte: ', data);

</script>

<h1>What can I do for you?</h1>

<h2>Simple to complex web and desktop apps</h2>
<p class="darkBackground">
	From simple apps to keep track of your spending to complex inventory systems, let's talk about
	what you need. For something customer facing I'll need a figma (or similar) design from you. I can
	also work with a designer.
</p>
<hr />
<h2>Webpages</h2>
<p class="darkBackground">
	I can put one or several webapps together in a webpage for you. A dashboard for internal use or,
	with your design, an interactive webpage for your customers. I created everything on this webpage
	myself. I code in Svelte/Javascript, but can also use React.
</p>
<hr />
<h2>Integrations between platforms</h2>
<p class="darkBackground">
	Do you have customer information in more than one platform (e.g. Mailchimp and Hubspot?) and you
	need a way to keep the information in sync when changes are made? I can set up a integration for
	you. Simple integrations can be done through Zapier (and I can show you some tricks) -- and if
	your needs are more complex I can create a custom integration (assuming the platform has a public
	API).
</p>

<hr />
<h2 id="contactFormitem">Contact me</h2>
<p class="darkBackground">
	Fill out the form below and I'll get back to you with my calendar link so we can set up a call to
	discuss your project. After that I'll write up a statement of work and a quote. Once we agree to
	that I can get started.
</p>

<div class="container">
	<div class="contactbox divbox">
		{#if submission_status === 'submitting'}
			<h3>Submitting...</h3>
		{:else if submission_status === 'failed'}
			<h3>Submission failed.</h3>
		{:else if submission_status === 'success'}
			<h3>Thanks for your message. I'll get back to you soon!</h3>
		{:else}
			<h2 style="margin-left:10%; margin-top:5%">Contact me</h2>
		{/if}

		<form method="POST"  use:enhance>
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
				></textarea>
				{#if wasSubmitted && $errors.memo}<span class="invalid">{$errors.memo}</span>{/if}

				<div class="turnstile-container">
					<Turnstile
						siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
						on:verify={(token) => turnstileResponse = token.detail}
						on:error={() => turnstileResponse = ''}
					/>
				</div>

				<button 
					type="submit" 
					class="submit-button" 
					disabled={!turnstileResponse}
				>
					Submit
				</button>

			</div>
		</form>
	</div>
</div>



<style>

.turnstile-container {
		margin: 1rem 0;
		display: flex;
		justify-content: center;
	}
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
