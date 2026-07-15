<script>
	let { data } = $props();
	const meta = data.meta;
</script>

<h1>{meta.appName} Privacy Policy</h1>

<p>
	This privacy notice describes how {meta.companyName} ("we", "us") handles information for the
	{meta.appName} app.
</p>

<h2>What we collect</h2>
<ul>
	<li>Usage data, as reported by the App store</li>
</ul>

<h2>How we use the data</h2>
<p>
	We use the data to operate and improve the app experience. Usage data helps ensure reliability and guide improvements.
</p>

<h2>Data tied to identity</h2>
<p>
	We do not collect personal identifiers. 
</p>

<h2>Data sharing</h2>
<p>
	We do not sell personal data. 
</p>

<h2>Retention</h2>
<p>
	We retain data only as long as needed for the purposes above.
</p>

<h2>Contact</h2>
<p>
	If you have questions about this policy or your data, contact us at
	<a href={`mailto:${meta.contactEmail}`}>{meta.contactEmail}</a>.
</p>
