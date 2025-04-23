<script lang="ts">
	// @ts-ignore
	import { Turnstile } from 'svelte-turnstile';
	

	let fname = $state('');
	let lname = $state('');
	let email = $state('');
	let serviceType = $state('Webpage');
	let memo = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		console.log('Form submission starting...');

		if (!turnstileResponse) {
			console.log('No Turnstile response');
			submission_status = 'Please complete the CAPTCHA';
			return;
		}
		console.log(turnstileResponse);

		const formData = new FormData();
		formData.append('fname', fname);
		formData.append('lname', lname);
		formData.append('email', email);
		formData.append('serviceTypes', serviceType);
		formData.append('memo', memo);
		formData.append('cf-turnstile-response', turnstileResponse);

		console.log('Form data being submitted:', Object.fromEntries(formData));
		submission_status = 'submitting';

		try {
			const response = await fetch('?/default', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				console.log('Form submission successful');
				submission_status = 'success';
				turnstileResponse = '';
				// Reset form
				fname = '';
				lname = '';
				email = '';
				serviceType = 'Webpage';
				memo = '';
			} else {
				console.log('Form submission failed:', result);
				submission_status = 'failed';
			}
		} catch (error) {
			console.error('Form submission error:', error);
			submission_status = 'failed';
		}
	}

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
			<h3>Failed to submit form. Please try again.</h3>
		{:else if submission_status === 'success'}
			<h3>Thanks for your message. I'll get back to you soon!</h3>
		{:else}
			<h2 style="margin-left:10%; margin-top:5%">Contact me</h2>
			<form method="POST" on:submit={handleSubmit}>
				<div class="myform">
					<label for="fname" class="label-short">
						<span class="label-text">First name</span>
					</label>
					<input
						type="text"
						id="fname"
						name="fname"
						bind:value={fname}
						aria-label="first name"
						placeholder=""
						required
						minlength="2"
					/>

					<label for="lname" class="label-short">
						<span class="label-text">Last name</span>
					</label>
					<input
						type="text"
						id="lname"
						name="lname"
						bind:value={lname}
						aria-label="last name"
						placeholder=""
						required
						minlength="2"
						autocomplete="off"
					/>

					<label for="email" class="label-short">
						<span class="label-text">Email</span>
					</label>
					<input
						type="email"
						id="email"
						name="email"
						bind:value={email}
						aria-label="email"
						placeholder=""
						required
						autocomplete="off"
					/>

					<label for="type" class="label-short">
						<span class="label-text">Type of service</span>
					</label>
					<select name="serviceTypes" bind:value={serviceType}>
						{#each serviceOptions as option}
							<option value={option}>{option}</option>
						{/each}
					</select>

					<label for="memo" class="label">
						<span class="label-text">How can I help?</span>
					</label>
					<textarea
						id="memo"
						name="memo"
						bind:value={memo}
						aria-label="How can I help?"
						placeholder=""
						required
						minlength="10"
						rows="3"
						autocomplete="off"
					/>

					<div class="turnstile-container">
						<Turnstile
							siteKey="0x4AAAAAAA0eaGKPwZsEx6Q2"
							on:turnstileSuccess={(e) => {
								turnstileResponse = e.detail.token;
							}}
							on:turnstileError={(e) => {
								console.error('Turnstile error:', e);
								turnstileResponse = '';
							}}
							on:turnstileExpire={() => {
								console.log('Turnstile expired');
								turnstileResponse = '';
							}}
						/>

				</div>
					<button 
						type="submit" 
						class="submit-button" 
						
					>
						Submit
					</button>
				</div>
			</form>
		{/if}
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
