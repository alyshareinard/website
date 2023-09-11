
<script>
    import { get_code } from './spotifyPkceAuth'

    
    function login() {
        get_code()
    }
</script>


<div class="flex justify-center items-center w-full h-screen">
    <div class="space-y-8">
        <div class="space-y-4">
            <h1 class="text-white font-bold text-3xl">Sign in</h1>
            <p class="text-white">with your Spotify account.</p>
        </div>
        <div>
            <button class="bg-green-500 font-bold text-white rounded-full px-4 py-2" on:click={login}>Sign in with Spotify</button>   
        </div>
    </div> 
</div>