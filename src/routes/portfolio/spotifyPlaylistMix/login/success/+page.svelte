<script>
import { onMount } from 'svelte';
import { goto } from '$app/navigation';

onMount(() => {
    // Redirect to the main app page after a brief delay
    setTimeout(() => {
        goto('/portfolio/spotifyPlaylistMix');
    }, 2000);
});
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-400 to-green-600">
    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 class="text-3xl font-bold mb-4 text-green-600">Successfully Connected!</h1>
        <p class="text-gray-600">You've successfully connected to Spotify.</p>
        <p class="text-gray-500 mt-2">Redirecting you to the app...</p>
        <div class="mt-4">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto"></div>
        </div>
    </div>
</div>
