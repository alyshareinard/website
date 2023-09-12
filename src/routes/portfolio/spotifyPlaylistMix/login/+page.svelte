<script>
export let data;
console.log(data.url)
</script>
<div class="flex justify-center items-center w-full h-screen">
    <div class="space-y-8">
        <div class="space-y-4">
            <h1 class="text-white font-bold text-3xl">Sign in</h1>
            <p class="text-white">with your Spotify account.</p>
        </div>
        <form method="POST">
            <button class="bg-green-500 font-bold text-white rounded-full px-4 py-2">Sign in with Spotify</button>   
        </form>
    </div> 
</div>