<script lang="ts">
	import { LOGNAME } from '$env/static/private';
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
		memo: z.string().min(10)
	});

	const { form, message, errors, enhance } = superForm(data.form, {
		validators: new_contact,
		resetForm: false,
		onSubmit: (event) => {
			submission_status = 'submitting';
		},
		onUpdated: ({ form }) => {
			if (form.valid) {
				submission_status = 'success';
			} else {
				submission_status = form.message;

			}

			
		},
		delayMs: 500
	});
</script>

<div class="contactbox divbox">
	<h2 style="margin-left:10%; margin-top:5%">Contact me</h2>

	{#if submission_status === 'submitting'}
		<h3>Submitting...</h3>
	{:else if submission_status === 'failed'}
		<h3>Submission failed.</h3>
	{:else if submission_status === 'success'}
		<h3>Thanks for your message. I'll get back to you soon!</h3>
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
				placeholder=""
				required
				autocomplete="off"
				class="input input-bordered w-full {$errors.fname ? 'input-error' : ''}, label-text-default"
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
				placeholder=""
				required
				autocomplete="off"
				class="input input-bordered w-full {$errors.lname ? 'input-error' : ''}, label-text-default"
			/>

			<label for="email" class="label-short">
				<span class="label-text">Email</span>
			</label>
			<input
				bind:value={$form.email}
				type="email"
				name="email"
				aria-label="email"
				placeholder=""
				required
				autocomplete="off"
				class="input input-bordered w-full {$errors.email ? 'input-error' : ''}, label-text-default"
			/>


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
				class="textarea input-bordered w-full {$errors.memo ? 'input-error' : ''}, label-text-default"
			/>
            
			<div style="margin-top:10%; margin-left:80%; margin-bottom:-10%">
			<input type="submit" value="Submit" class="btn btn-primary w-full mt-10" />
		</div>
        </div>
        </form>
	{/if}


</div>
<style>
    .myform{
        display:grid;
        justify-content: start;
        gap: 5%;
        margin: 4% 10% 10% 10%;
        grid-template-columns: 1fr 3fr;
        
    }

    .label{
        grid-column:1
    }
    .label-short{
        grid-column:1
    }
    .label-text {
        color: var(--mainThemeLight);
		font: var(--sk-font);
    }
	.label-text-default {
		font-size: 0.8rem;
		font: var(--sk-font-mono);
	}
	.contactbox {
		width:fit-content;
        height:fit-content;
	}

</style>