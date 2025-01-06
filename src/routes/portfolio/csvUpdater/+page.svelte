<script>
	import { enhance } from '$app/forms';
	import PapaParse from 'papaparse';
	let message = $state('');
	const maxFileSize = 1000000;
	let myfile = $state(),
		csvOutput = $state(),
		href = $state(),
		keys = $state(),
		columns = $state();
	let downloadReady = $state(false);
	let initialcsv = [];
	let renamed = $state(false);
	let transformation = $state(false);
	let selected = false;

	function uploadFile(myfile) {
		const file = myfile.files[0];
		if (file.size > maxFileSize) {
			message = 'Above the max file size threshold';
			return;
		}
		const fileExtensionArray = file.type.split('/');
		const fileExtension = fileExtensionArray[fileExtensionArray.length - 1];

		if (fileExtension.includes('csv')) {
			console.log('ready to papaparse');
			const csvData = PapaParse.parse(
				file,

				{
					header: true,
					encoding: 'ISO-8859-1',
					error: (err, file) => {
						console.log(err);
					},
					complete: (results) => {
						console.log(results);
						message = 'working...';
						if (results.errors.length > 0) {
							console.log(results.errors);
							message = 'error: ' + results.errors[0].message;
						}
						create_columns(results.data);
					}
				}
			);
		} else {
			message = 'Not an allowed file type';
		}
	}
	function create_columns(data) {
		initialcsv = data;
		message = "Your CSV is uploaded.  Select the columns you'd like to keep.";
		keys = Object.keys(data[0]);

		columns = [];
		for (let i = 0; i < keys.length; i++) {
			columns.push({
				text: keys[i],
				status: false,
				change: ''
			});
		}
	}

	function create_output() {
		let data = initialcsv;

		let newcsv = [];
		let newdata = [];
		let fields = [];

		for (let i = 0; i < columns.length; i++) {
			if (columns[i].status) {
				if (columns[i].rename) {
					fields.push(columns[i].newname);
				} else {
					fields.push(columns[i].text);
				}
			}
		}
		newcsv.push(fields);

		for (let j = 0; j < data.length; j++) {
			newdata = [];
			for (let i = 0; i < columns.length; i++) {
				if (columns[i].status) {
					if (columns[i].change == 'Reverse') {
						newdata.push(data[j][columns[i].text].split('').reverse().join(''));
					} else if (columns[i].change == 'Concatenate') {
						newdata.push(data[j][columns[i].text].concat('-').concat(j));
					} else {
						newdata.push(data[j][columns[i].text]);
					}
				}
			}

			newcsv.push(newdata);
		}
		console.log('newcsv', newcsv);
		csvOutput = PapaParse.unparse({
			data: newcsv,
			fields: fields
		});

		href = encodeURI('data:text/csv;charset=utf-8,' + csvOutput);
		message = 'Your CSV ready to download.';
		downloadReady = true;

		return message, href;
	}
	function toggleSelect(column) {
		transformation = true;
		column.status == true ? (column.status = false) : (column.status = true);
		selected = true;
		if (column.status == false) {
			column.rename = false;
		}
	}
	function toggleRename(column) {
		renamed = true;
		column.rename == true ? (column.rename = false) : (column.rename = true);
		if (column.rename == true) {
			column.status = true;
			transformation = true;
		}
	}
</script>

<div>
	<h1>CSV cleaner</h1>
	<h3>
		How often do you download a csv file and then have to manually remove or rename fields,
		concatenate values, format phone numbers etc. before uploading the file to another program?
	</h3>
	<h3>
		I can create a web or desktop app that automatically makes the changes you need. If the apps you
		use have a good API I can even remove the download and upload steps.
	</h3>
	<h3>
		Here I've created a toy example that lets you select fields you want to keep and those you want
		to rename. For each you can then <i>Reverse</i> (reverse the order of the letters or numbers in
		each cell), <i>Concatenate</i> (add '-' plus the row number to each cell), or leave them unchanged.
	</h3>
	<h3>I can create a custom version for you that handles any formatting you need.</h3>
	<h2>Let's clean up that CSV file!</h2>

	<label for="myfile">Select a file:</label>
	<input
		type="file"
		id="myfile"
		name="myfile"
		bind:this={myfile}
		accept=".csv"
		onchange={() => uploadFile(myfile)}
	/>
</div>

{#if keys}
	<div>
		<div class="mylist">
			<div class="column">
				<p style="grid-column-start:1" class="colhead">Select</p>
				<p class="colhead">Rename</p>
				<p>column</p>
				{#if transformation}
					<p>transformation</p>
				{/if}
				{#if renamed}
					<p>new name</p>
				{/if}

				{#each columns as column}
					<div style="grid-column-start:1">
						<input
							bind:checked={column.status}
							type="checkbox"
							onclick={() => toggleSelect(column)}
						/>
					</div>
					<input
						bind:checked={column.rename}
						type="checkbox"
						onclick={() => toggleRename(column)}
					/>
					<span class:checked={column.status}>{column.text}</span>
					{#if column.status}
						<select bind:value={column.change}>
							<option disabled value="">Select</option>
							<option>No change</option>
							<option>Reverse</option>
							<option>Concatenate</option>
						</select>
					{/if}
					{#if column.rename}
						<input bind:value={column.newname} type="text" placeholder={column.text} />
					{/if}
				{/each}
			</div>
			<button onclick={() => create_output()}> Process </button>
		</div>
	</div>
{/if}
{#if message}
	<p>{message}</p>
{/if}
{#if downloadReady}
	<button onclick={csvOutput}><a {href} download="output.csv">Download</a></button>
{/if}

<style>
	.mylist {
		display: flex;
		flex-direction: column;
		margin-top: 20px;
	}
	.column {
		display: grid;
		grid-template-columns: 20px 20px 2fr 1fr 1fr;
		width: fit-content;
	}
	button a {
		text-decoration: none;
	}
	.colhead {
		transform: rotate(-90deg);
		align-self: bottom;
	}
</style>
