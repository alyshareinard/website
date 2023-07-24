<script>

    import {scale,fly} from 'svelte/transition';
    export let toggleContact;

    import { enhance } from '$app/forms';

</script>


<div class="modal">
<div class="contactCard" transition:fly={{y:40}}>
    <h1> Contact Me </h1>
    <p> Please fill out the form below to contact me. </p>

    <button on:click={toggleContact}>X</button>

    <form use:enhance method="POST">
        <label>
            Name: <input type="text" required name="name" id="name" />
        </label>
        <label>
            Email: <input type="email" required name="email" id="email" />
        </label>
        <label>
            Message: <textarea required name="message" id="message" />
        </label>
        <button type="submit">Send Email</button>
    </form>
</div>
<div on:click={toggleContact} transition:scale={{start:1.2, duration:1000}} class=background />
</div>

<style>
    .modal {
        position: fixed;
        display: flex;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        align-items: center;
        justify-content: center;
    }
    .contactCard{
        background-color:white;
        text-align: center;

    }
    .background{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: black;
        opacity:0.8;
    }
    form {
        padding:20px;
        border: 3px solid #f1f1f1;
        display:flex;
        gap:20px;
        flex-direction:column;
    }
    label {
        display:block;
    }
</style>