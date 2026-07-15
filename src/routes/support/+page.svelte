<script>
	let { data } = $props();
	const meta = data.meta;
</script>

<h1>{meta.appName} Support</h1>

<p>
	Need help with {meta.appName}? We're here for you.
</p>

<h2>Contact options</h2>
<ul>
	{#if meta.supportUrl}
		<li>
			<strong>Support Portal:</strong>
			<a href={meta.supportUrl} rel="noopener noreferrer" target="_blank">{meta.supportUrl}</a>
		</li>
	{/if}
	{#if meta.supportEmail}
		<li>
			<strong>Email:</strong>
			<a href={`mailto:${meta.supportEmail}`}>{meta.supportEmail}</a>
		</li>
	{:else}
		<li>
			<strong>Email:</strong>
			<a href={`mailto:${meta.contactEmail}`}>{meta.contactEmail}</a>
		</li>
	{/if}
</ul>

<h2>What to include</h2>
<p>To help us resolve your issue quickly, please include:</p>
<ul>
	<li>What you were trying to do</li>
	<li>What happened instead (include any error message)</li>
	<li>Your device and OS version</li>
	<li>App version, if available</li>
</ul>
