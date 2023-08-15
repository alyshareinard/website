
<script>

import Papa from 'papaparse';

export let onUpload;
export let allowedFileExtensions = ['csv'];

const maxFileSize = 1000000;
let uploader;
let prevDataToCSV;
export let dataToCSV = [];

$: {
        // called on props change
        if (dataToCSV !== prevDataToCSV && dataToCSV.length !== 0) {
            prevDataToCSV = dataToCSV;
            const csvData = Papa.unparse(dataToCSV);
            onUpload ? onUpload(csvData) : console.log("Remember to define an onUpload function as props. CSV Data:", csvData);
        }
    }


function uploadFile(event) {
        event.preventDefault();
        const file = uploader.files[0];

        const fileExtensionArray = file.type.split("/");
        const fileExtension = fileExtensionArray[fileExtensionArray.length-1];

        if (file.size > maxFileSize) {
            console.log("Above the max file size threshold")
            return;
        }
        if (fileExtension.includes('csv') && file.size < maxFileSize ) {

            const csvData = Papa.parse(
                file,
                {
                    complete: (results) => {
                        onUpload ? onUpload(results.data) : console.log("Remember to define an onUpload function as props. Parsed CSV:", results.data);
                    }
                }
            );
        } else if (allowedFileExtensions.includes(fileExtension)) {
            onUpload ? onUpload(file) : console.log("Remember to define an onUpload function as props. Plain file:", file);
        } else {
            console.log("Not an allowed file type");
        }
    }

</script>



<body>
    <div>
        <h1>Hello</h1>
        <h2>Let's clean up those contacts!</h2>
        <input type="file" bind:this={uploader} on:change={uploadFile} />

    </div>
</body>

<style>
    body{
        background:transparent
    }
</style>