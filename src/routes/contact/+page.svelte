<!-- @migration-task Error while migrating Svelte code: Cannot use `export let` in runes mode — use `$props()` instead
https://svelte.dev/e/legacy_export_invalid -->
<script lang="ts">
	import { superForm, type JSONSchema } from 'sveltekit-superforms';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import SuperDebug from 'sveltekit-superforms';
	import ContactForm from './ContactForm.svelte';

	//	import {formSchema} from "./schema.ts";

	//	import ContactForm from './ContactForm.svelte';
	//adapted from https://scottspence.com/posts/sveltekit-contact-form-example-with-airtable

	//	export let form;

	//	export let data;
	let { data } = $props();
	console.log('in page.svelte: ', data);
	// Client API:
	//const { form, errors, constraints, message, enhance } = superForm(data.form);
	//let form = superForm(data.form, {
	//	validators: zodClient(formSchema)
	//});

	//	onMount(() => {
	//		console.log("data: ", data.form);
	//	})

	//	let form = $state();
	//let form  = $state(superForm(data.form));
	//$effect(() => {let form  = $state(superForm(data.form));});

	//	export let myform;

	const turnstile_key = PUBLIC_TURNSTILE_SITE_KEY;
	let wasSubmitted = $state(false);
	let submission_status = $state('');
	let formError = '';
	const serviceOptions = ['Webpage', 'App', 'Integration']; // as const;
	const { form, message, errors, constraints, enhance } = superForm(data.form);
	/*	
const { form, message, errors, constraints, enhance } = superForm(data.form, {
		//validators: new_contact, 
		resetForm: false,
		taintedMessage: null,

		onSubmit: (event) => {
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
	}); */
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

		{#if errors}
			<p>Captcha failed</p>
		{:else}
			<ContactForm {data} {wasSubmitted} {submission_status} />
		{/if}

		<form method="POST">
			<Turnstile siteKey={PUBLIC_TURNSTILE_SITE_KEY} theme="dark" />
		</form>
	</div>
</div>

<style>
</style>
