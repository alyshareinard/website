<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { contactFormSchema } from '$lib/schemas';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import { z } from 'zod';

	import { scale, fly } from 'svelte/transition';
	export let showContact:boolean;

//	import { enhance } from '$app/forms';

	export let data: SuperValidated<contactFormSchema>;

	let submission_status = '';

	const new_contact = z.object({
		name: z.string().min(2),
		email: z.string().email(),
		message: z.string().min(10)
	});

	const { form, errors, message, enhance } = superForm(data, {
		validators: new_contact,
		resetForm: true,
        
		onSubmit: () => {
			submission_status = 'submitting';
		},
		onError: () => {
			submission_status = 'failed';
		},
		onUpdated: () => {
			submission_status = 'success';
		}
	});
</script>

<div class="modal">
    
	<div class="contactCard" transition:fly={{ y: 40 }}>
        <button style="float: right;" on:click={()=>{showContact=false}}>X</button>
		<h1>Contact Me</h1>
		<p>How can I help?</p>

		<div class="mx-auto max-w-xl">
            {#if $message}
            <div class="message">{$message}</div>
            {/if}
			{#if submission_status === 'submitting'}
				<p>Submitting...</p>
                console.log(response)
			{:else if submission_status === 'failed'}
				<p>Submission failed.</p>
                console.log(response)
			{:else if submission_status === 'success'}
				<p>Submission success.</p>

				<button
					data-sveltekit-reload
					on:click={() => {
						submission_status = '';
					}}
					class="btn btn-primary w-full"
				>
					Submit another?
				</button>
			{:else}
				<form method="POST" use:enhance>
					<label for="name" class="label">
						<span class="label-text">Name</span>
					</label>
					<input
						bind:value={$form.name}
						type="text"
						name="name"
						aria-label="name"
						placeholder="Enter your name"
						required
						autocomplete="off"
						class="input input-bordered w-full"
					/>

					<label for="email" class="label">
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
						class="input input-bordered w-full"
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
						class="textarea input-bordered w-full"
					/>


					<input type="submit" value="Submit" class="btn btn-primary w-full mt-10" />
				</form>
			{/if}


			<h2>Superforms SuperDebug component</h2>

			<SuperDebug data={$form} />
		</div>
	</div>
    <div on:click={()=>{showContact=false}} transition:scale={{start:1.2, duration:1000}} class=background />
</div>


<style>
    .modal {
        position: fixed;
        display: flex;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        align-items: center;
        justify-content: center;
        
    }
    .contactCard{
        background-color:white;
        text-align: center;

    }
    .background{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: black;
        opacity:0.8;
    }
    form {
        padding:20px;
        border: 3px solid #f1f1f1;
        display:flex;
        gap:20px;
        flex-direction:column;
    }
    label {
        display:block;
		color:darkcyan; 
    }

    p {
        color:aqua; 
    }
</style>