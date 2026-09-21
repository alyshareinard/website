<script>
	import github from '$lib/images/github-mark-white.svg';
	import linkedin from '$lib/images/In-White-96.png';
	import upwork from '$lib/images/upwork-round-white.png';

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="inner">
		<div class="social">
			<a href="https://github.com/alyshareinard" aria-label="GitHub">
				<img src={github} alt="" />
			</a>
			<a href="https://www.linkedin.com/in/alysha-reinard/" aria-label="LinkedIn">
				<img src={linkedin} alt="" />
			</a>
			<a href="https://www.upwork.com/freelancers/~0195af2deb010d271c" aria-label="Upwork">
				<img src={upwork} alt="" />
			</a>
		</div>

		<nav aria-label="Footer">
			<a href="/portfolio">Work</a>
			<a href="/games">Games</a>
			<a href="/about">About</a>
			<a href="/contact#contactForm">Contact</a>
		</nav>

		<p class="copyright">© {year} Tech-Aly</p>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--border);
		background: rgba(10, 18, 20, 0.6);
	}

	.inner {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		max-width: var(--content-width);
		margin: 0 auto;
		padding: 1.25rem;
	}

	.social {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.social img {
		width: 24px;
		height: 24px;
		object-fit: contain;
		opacity: 0.8;
		transition: opacity 0.2s ease;
	}

	.social a:hover img {
		opacity: 1;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
	}

	nav a {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.95rem;
	}

	nav a:hover {
		color: var(--accent);
	}

	.copyright {
		margin: 0;
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	@media (max-width: 600px) {
		.inner {
			flex-direction: column;
			text-align: center;
		}

		nav {
			justify-content: center;
		}
	}
</style>
