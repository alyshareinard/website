<script>
	import { enhance } from '$app/forms';
	import PapaParse from 'papaparse';
	let message = '';
	const maxFileSize = 1000000;
	let myfile;
	let csvOutput;
	let href;
	let keys;
	let columns;
	let downloadReady = false;
	let initialcsv = [];
	let renamed=false;
	let transformation=false;

	function uploadFile(myfile) {
		const file = myfile.files[0];

		const fileExtensionArray = file.type.split('/');
		const fileExtension = fileExtensionArray[fileExtensionArray.length - 1];

		if (fileExtension.includes('csv')) {
			const csvData = PapaParse.parse(
				file,

				{
					header: true,
					complete: (results) => {
						message = 'working...';
						create_columns(results.data);
					}
				}
			);
		} else {
			message = 'Not an allowed file type';
		}
	}
	function create_columns(data) {
		console.log('in create output');
		initialcsv = data;
		message = "Your CSV is uploaded.  Select the columns you'd like to keep.";
		keys = Object.keys(data[0]);
		console.log('keys', keys);
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
		console.log('length is ', data.length);
		let newcsv = [];
		let newdata = [];
		let fields = []
	
		for (let i = 0; i < columns.length; i++) {
			if (columns[i].status) {
				if (columns[i].rename) {
					fields.push(columns[i].newname);
				} else {
					fields.push(columns[i].text);
				}
				
			}
		}
		newcsv.push(fields)

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
			
			newcsv.push( newdata );
		}
		console.log(newcsv)
		csvOutput = PapaParse.unparse(newcsv, {

		});
		console.log("Here's the output", csvOutput);
		href = encodeURI('data:text/csv;charset=utf-8,' + csvOutput);
		message = 'Your CSV ready to download.';
		downloadReady = true;

		return message, href;
	}
	function toggleSelect(column) {
		console.log('toggling');
		transformation=true;
		column.status == true ? (column.status = false) : (column.status = true);
		selected=true
	}
	function toggleRename(column) {
		console.log('toggling');
		renamed=true
		column.rename == true ? (column.rename = false) : (column.rename = true);
		if (column.rename==true){
			column.status=true;
			transformation=true;
		}
	}
</script>

<div>
	<h1>CSV cleaner</h1>
	<h3>How often do you download a csv file and then have to manually remove or rename fields, concatenate values, format phone numbers etc. before uploading the file to another program?</h3>
	<h3>I can create a web or desktop app that automatically makes the changes you need.  If the apps you use have a good API I can even remove the download and upload steps. </h3>
	<h3> Here I've created a toy example that lets you select fields you want to keep and then <i>Reverse</i> (reverse the order of the letters or numbers in each cell), <i>Concatenate</i> (add '-' plus the row number to each cell), and/or <i>Rename</i> the field. </h3>

	<h2>Let's clean up that CSV file!</h2>

	<input type="file" bind:this={myfile} accept=".csv" />

	<button on:click={() => uploadFile(myfile)}> Upload </button>
</div>


{#if keys}
	<div>
		<div class="mylist">
			<div class="column">
			<p style="grid-column-start:1" class="colhead">Select</p>
			<p class="colhead">Rename</p>
			<p> column </p>
			{#if transformation}
			<p> transformation </p>
			{/if}
			{#if renamed}
			<p> new name </p>
			{/if}
			

			{#each columns as column}
				<div style="grid-column-start:1">
					<input
						bind:checked={column.status}
						type="checkbox"
						on:click={() => toggleSelect(column)}
					/>
				</div>
					<input
					bind:checked={column.rename}
					type="checkbox"
					on:click={() => toggleRename(column)}
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
					<input bind:value={column.newname} type="text" placeholder={column.text}   />

					{/if}

			{/each}
		</div>
			<button on:click={() => create_output()}> Process </button>
		</div>
	</div>
{/if}
{#if message}
	<p>{message}</p>
{/if}
{#if downloadReady}
	<button on:click={csvOutput}><a {href} download="output.csv">Download</a></button>
{/if}

<style>
	.mylist {
		display: flex;
		flex-direction: column;
		margin-top: 20px;
	}
	.column {
		display: grid;
		grid-template-columns:20px 20px 2fr 1fr 1fr;
		width: fit-content;
		
	}
	button a {
		text-decoration: none;
	}
	.colhead {
		transform:rotate(-90deg);
		align-self: bottom;

	}

</style>
