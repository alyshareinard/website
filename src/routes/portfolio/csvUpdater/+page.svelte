<script>
	import { enhance } from '$app/forms';

	const maxFileSize = 1000000;
	let uploader;
	let prevDataToCSV;
	export let dataToCSV = [];

	$: {
		// called on props change
		if (dataToCSV !== prevDataToCSV && dataToCSV.length !== 0) {
			prevDataToCSV = dataToCSV;
			const csvData = Papa.unparse(dataToCSV);
			onUpload
				? onUpload(csvData)
				: console.log('Remember to define an onUpload function as props. CSV Data:', csvData);
		}
	}
</script>

<body>
	<div>
		<h1>Hello</h1>
		<h2>Let's clean up those contacts!</h2>

		<form use:enhance method="POST">
			<input type="file" bind:this={uploader} accept=".csv" />

			<button> Get cleaned csv </button>
		</form>
	</div>
</body>

<style>
	body {
		background: transparent;
	}
</style>
