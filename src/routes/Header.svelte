<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/fav_logo.png';

</script>

<header>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="Tech-Aly" />
		</a>
	</div>

	{#if $page.url.pathname != '/'}
		<nav>
			<svg viewBox="0 0 2 3" aria-hidden="true">
				<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
			</svg>
			<ul>
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">Home</a>
				</li>
				<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
					<a href="/about">About</a>
				</li>
				<li aria-current={$page.url.pathname.startsWith('/offerings') ? 'page' : undefined}>
					<a href="/contact">Offerings</a>
				</li>
				<li aria-current={$page.url.pathname.startsWith('/portfolio') ? 'page' : undefined}>
					<a href="/portfolio">Portfolio</a>
				</li>
			</ul>
			<svg viewBox="0 0 2 3" aria-hidden="true">
				<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
			</svg>
		</nav>
	{:else}
		<h1 class="hoverRainbow">Webapps, Websites, Integrations</h1>
	{/if}

	<div class="rightCorner">
		<button> login </button>
		<button> En/Fr </button>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 6em;
		height: 6em;
	}
	.rightCorner {
		width: 10em;
		height: 3em;
		justify-content: right;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 5em;
		height: 5em;
		object-fit: contain;
	}

	.rightCorner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	@keyframes textShine {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 100% 50%;
		}
	}

	.hoverRainbow {
		font-weight: 800;
	}
	.hoverRainbow:hover {
		background-image: linear-gradient(140deg, violet, indigo, blue, green, yellow, orange, red);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: textShine 10s ease-in infinite alternate;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: var(--mainTheme);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: white;
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent);
	}

	@media (max-width: 390px) {
		nav ul {
			flex-direction:column;
			overflow: auto;
			justify-content:start;
		}
		li[aria-current='page']::before {
			width: 100%;
			border-top: var(--size) solid transparent;
		}

	}
</style>
