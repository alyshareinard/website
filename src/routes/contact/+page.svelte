<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { z } from 'zod';
    //adapted from https://scottspence.com/posts/sveltekit-contact-form-example-with-airtable

	export let data;

	let submission_status = '';

	const new_contact = z.object({
		fname: z.string().min(2),
        lname: z.string().min(2),
		email: z.string().email(),
		message: z.string().min(10)
	});

	const { form, errors, enhance } = superForm(data.form, {
		validators: new_contact,
		resetForm: true,
		onSubmit: (event) => {
			submission_status = 'submitting';
		},
		onUpdated: ({ form }) => {
			if (form.valid) {
				submission_status = 'success';
			}
			submission_status = '';
		},
		delayMs: 500
	});
</script>

<div>
	<h2 style="margin-left:10%; margin-top:5%">Contact me</h2>

	{#if submission_status === 'submitting'}
		<p>Submitting...</p>
	{:else if submission_status === 'failed'}
		<p>Submission failed.</p>
	{:else if submission_status === 'success'}
		<p>Thanks.  I'll get back to you soon!</p>
	{:else}

    
		<form method="POST" use:enhance>
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
				placeholder="first name"
				required
				autocomplete="off"
				class="input input-bordered w-full {$errors.fname ? 'input-error' : ''}"
			/>


            <label for="lname" class="label-short">
				<span class="label-text">Last name</span>
			</label>
			<input
				bind:value={$form.lname}
				data-invalid={$errors.lname}
				type="text"
				name="lname"
				aria-label="last name"
				placeholder="last name"
				required
				autocomplete="off"
				class="input input-bordered w-full {$errors.lname ? 'input-error' : ''}"
			/>

			<label for="email" class="label-short">
				<span class="label-text">Email</span>
			</label>
			<input
				bind:value={$form.email}
				type="email"
				name="email"
				aria-label="email"
				placeholder="bill@hotmail.com"
				required
				autocomplete="off"
				class="input input-bordered w-full {$errors.email ? 'input-error' : ''}"
			/>


			<label for="message" class="label">
				<span class="label-text">Message</span>
			</label>
			<textarea
				bind:value={$form.message}
				name="message"
				aria-label="message"
				placeholder="Message"
				required
				rows="3"
				autocomplete="off"
				class="textarea input-bordered w-full {$errors.message ? 'input-error' : ''}"
			/>
            <br>

			<input type="submit" value="Submit" class="btn btn-primary w-full mt-10" />
        </div>
        </form>
	{/if}
</div>
<style>
    .myform{
        display:grid;
        justify-content: start;
        gap: 2%;
        margin: 4% 10% 10% 10%;
        grid-template-columns: auto auto auto;
        
    }

    .label{
        grid-column:1
    }
    .label-short{
        grid-column:1
    }
    .label-text {
        color: var(--mainThemeLight)
    }
</style>