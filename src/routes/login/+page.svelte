<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { loginSchema } from './login-schema';
	let { data } = $props();
	let wasSubmitted = $state(false);
	let submission_status = '';

	const { form, message, errors, constraints, enhance } = superForm(data.form, {

		resetForm: false,
		taintedMessage: null,

		onSubmit: (event) => {
			wasSubmitted = true;
			submission_status = 'submitting';
		},
		onUpdated: ({ form }) => (submission_status = form.valid ? 'success' : form.message),
		delayMs: 500
	});
</script>

<div class="divbox loginbox">
	<h2>Login</h2>
	<form method="POST" use:enhance>
		<div class="myform">
			<label for="login" class="label-short">
				<span class="label-text">Username</span>
			</label>
			<input
				bind:value={$form.login}
				data-invalid={$errors.login}
				type="text"
				name="login"
				aria-label="login"
				placeholder=""
				required
				{...$constraints.login}
			/>
			{#if wasSubmitted && $errors.login}<span class="invalid">{$errors.login}</span>{/if}

			<label for="password" class="label-short">
				<span class="label-text">Password</span>
			</label>
			<input
				bind:value={$form.password}
				data-invalid={$errors.password}
				type="password"
				name="password"
				aria-label="password"
				placeholder=""
				required
				{...$constraints.password}
			/>
			{#if wasSubmitted && $errors.password}<span class="invalid">{$errors.password}</span>{/if}

			<div style="margin-top:10%; margin-left:80%; margin-bottom:-10%">
				<input type="submit" value="Submit" class="btn" />
			</div>
		</div>
	</form>
	{#if wasSubmitted}
		<h4 class="warning">User not found</h4>
		<h5>If you'd like to work with me, please use the <a href="/contact">contact form</a></h5>
	{/if}
</div>

<style>
	.background {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: -1;
		opacity: 0.9;
		background: linear-gradient(142deg, pink 5%, lightblue 100%);
	}
	.warning {
		color: red;
		text-align: center;
	}
	.myform {
		display: grid;
		justify-content: start;
		gap: 5%;
		margin: 4% 10% 10% 10%;
		grid-template-columns: 1fr 3fr;
	}
	.loginbox {
		width: 60%;
		margin-top: 20px;
		margin-left: 15%;
	}
	input {
		width: 100%;
	}
	input.btn {
		width: auto;
	}
	@media (max-width: 390px) {
	}
</style>
