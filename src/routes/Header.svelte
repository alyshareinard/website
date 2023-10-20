<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/fav_logo.png';
	//<button on:click={() => console.log("clicked")}> En/Fr </button>
</script>

<header>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="Tech-Aly logo" />
		</a>
	</div>

	{#if $page.url.pathname != '/'}
		<div class="navdiv">
			<nav>
				<ul>
					<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
						<a href="/">Home</a>
					</li>
					<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
						<a href="/about">About</a>
					</li>
					<li aria-current={$page.url.pathname.startsWith('/contact') ? 'page' : undefined}>
						<a href="/contact">Offerings</a>
					</li>
					<li aria-current={$page.url.pathname.startsWith('/portfolio') ? 'page' : undefined}>
						<a href="/portfolio">Portfolio</a>
					</li>
				</ul>
			</nav>
		</div>
	{:else}
		<h1 class="hoverRainbow">Custom apps and integrations</h1>
		<h1 class="shortTitle">Custom apps</h1>
	{/if}

	<div class="rightCorner">
		<button><a href="/login">login</a> </button>
		
		
	</div>

</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.corner {
		float:left;
		width: 5em;
	}
	.rightCorner {
		float:right;
		display: flex;
		flex-wrap: wrap;

	}
	.shortTitle {
		display: none;
	}

	.corner img {
		width: 4em;
		object-fit: contain;
	}
	button {
		font-size:12px;
		padding:5px;
		margin:5px;
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
		justify-content: center;
		text-align: center;
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
		background: var(--mainTheme);
	}

	.navdiv {
		border-radius: 2px;
		border-color: var(--accent);
		border-top: solid;
		border-bottom: solid;
		background: var(--background);
		align-items: center;
	}
	ul {
		padding: 20px;
		margin: 0;
		display: flex;
		list-style: none;
	}

	li {
		position: relative;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		position: absolute;
		bottom: calc(1.3 * var(--size));
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent);
	}

	nav a, button a {
		display: flex;
		align-items: center;
		color: white;
		text-decoration: none;
		transition: color 0.2s linear;
	}
	nav a {
		padding: 0 0.5rem;
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;

	}

	a:hover {
		color: var(--accent);
	}

	@media (max-width: 390px) {
		nav ul {
			padding: 5px;
			flex-direction: column;
			overflow: auto;
			justify-content: start;
		}
		li[aria-current='page']::before {
			bottom: calc(50% - var(--size));
			left: 0;
			border: var(--size) solid transparent;
			border-left: var(--size) solid var(--accent);
		}
		.shortTitle {
			display: block;
			visibility: visible;
			font-weight: 800;
			justify-content: center;
			text-align: center;
		}
		.hoverRainbow {
			display: none;
		}
		.rightCorner {

			width: 5em;
			height:5em;
			top: 0;
		}
		.navdiv {

		border-top: none;
		border-bottom: none;
		border-left: solid;
		border-right: solid;
	}
	}
</style>
