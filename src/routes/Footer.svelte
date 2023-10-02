
<script>
    import github from '$lib/images/github-mark-white.svg';
	import linkedin from '$lib/images/In-White-96.png';
	import upwork from '$lib/images/upwork-round-white.png';
</script>

<footer>

   
    <div class="social">
		<a href="https://github.com/alyshareinard">
			<img src={github} alt="GitHub" />
		</a>
		<a href="https://www.linkedin.com/in/alysha-reinard/">
			<img src={linkedin} alt="LinkedIn" />
		</a>
		<a href="https://www.upwork.com/freelancers/~0195af2deb010d271c">
			<img src={upwork} alt="Upwork" />
		</a>
	</div>
    <a href="/contact#contactForm">Contact me</a>
    <p class=darkBackground>© 2023 Tech-Aly</p>
</footer>


<style>

    footer {
		padding: 10px 20px 1px 20px;
        bottom:0;
        background:var(--mainThemeOpacity);
        margin:-10px;
        display:flex;
        flex-flow:row;
        justify-content:space-between;
    }
    p {
        font-size: smaller;
    }
    a {
        align-self:center;
    }
    .social {
        margin-top:10px;
        width: 7em;
		height: 3em;
    }
    .social img {
        --height:25px;
		width: var(--height);
		height: var(--height);
		object-fit: contain;
	}



</style>