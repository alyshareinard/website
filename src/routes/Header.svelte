<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/fav_logo.png';

	let menuOpen = $state(false);

	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' },
		{ label: 'Services', href: '/contact' },
		{ label: 'Portfolio', href: '/portfolio' }
	];

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<header>
	<div class="header-top">
		<div class="corner">
			<a href="/" onclick={closeMenu}>
				<img src={logo} alt="Tech-Aly logo" />
			</a>
		</div>

		<div class="navdiv desktop-nav" id="main-nav">
			<nav>
				<ul>
					{#each navItems as item}
						<li
							aria-current={$page.url.pathname === item.href ||
							($page.url.pathname === '/' && item.href === '/') ||
							($page.url.pathname !== '/' &&
								$page.url.pathname.startsWith(item.href) &&
								item.href !== '/')
								? 'page'
								: undefined}
						>
							<a href={item.href} onclick={closeMenu}>{item.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>

		<button
			class="menu-toggle"
			onclick={toggleMenu}
			aria-label="Toggle navigation"
			aria-expanded={menuOpen}
			aria-controls="main-nav"
		>
			<span class="hamburger" class:open={menuOpen}></span>
		</button>
	</div>

	{#if $page.url.pathname === '/'}
		<div class="mainTitle">
			<h1 class="hoverRainbow">Small Business Tech Partner</h1>
			<p>Apps, automations, and integrations built for your workflow.</p>
		</div>
	{/if}

	<div class="navdiv mobile-nav" class:open={menuOpen} id="main-nav">
		<nav>
			<ul>
				{#each navItems as item}
					<li
						aria-current={$page.url.pathname === item.href ||
						($page.url.pathname === '/' && item.href === '/') ||
						($page.url.pathname !== '/' &&
							$page.url.pathname.startsWith(item.href) &&
							item.href !== '/')
							? 'page'
							: undefined}
					>
						<a href={item.href} onclick={closeMenu}>{item.label}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem 0;
	}

	.header-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.corner {
		width: 4em;
		flex-shrink: 0;
	}

	.corner img {
		width: 3.5em;
		object-fit: contain;
	}

	.mainTitle {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.mainTitle h1 {
		margin: 0;
		font-size: 1.75rem;
		line-height: 1.2;
	}

	.mainTitle p {
		margin: 0.25rem 0 0 0;
		font-size: 1rem;
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

	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background: transparent;
		border: 2px solid var(--accent);
		border-radius: 4px;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
	}

	.hamburger,
	.hamburger::before,
	.hamburger::after {
		display: block;
		width: 1.25rem;
		height: 2px;
		background: var(--accent);
		transition:
			transform 0.2s ease,
			opacity 0.2s ease;
	}

	.hamburger {
		position: relative;
	}

	.hamburger::before,
	.hamburger::after {
		content: '';
		position: absolute;
		left: 0;
	}

	.hamburger::before {
		top: -6px;
	}

	.hamburger::after {
		top: 6px;
	}

	.hamburger.open {
		background: transparent;
	}

	.hamburger.open::before {
		transform: translateY(6px) rotate(45deg);
	}

	.hamburger.open::after {
		transform: translateY(-6px) rotate(-45deg);
	}

	.navdiv {
		display: none;
		border-radius: 4px;
		border: 2px solid var(--accent);
		background: var(--mainTheme);
		overflow: hidden;
	}

	.navdiv.open {
		display: block;
	}

	.desktop-nav {
		display: none;
	}

	nav {
		display: flex;
		justify-content: center;
		background: var(--mainTheme);
	}

	ul {
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		list-style: none;
		width: 100%;
	}

	li {
		position: relative;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}

	li:last-child {
		border-bottom: none;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		position: absolute;
		left: 0.75rem;
		top: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-left: var(--size) solid var(--accent);
	}

	nav a {
		display: block;
		color: white;
		text-decoration: none;
		transition:
			color 0.2s linear,
			background 0.2s linear;
		padding: 0.75rem 1.5rem;
		font-weight: 700;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	nav a:hover {
		color: var(--accent);
		background: rgba(0, 0, 0, 0.15);
	}

	@media (min-width: 768px) {
		header {
			gap: 1rem;
		}

		.header-top {
			justify-content: space-between;
			align-items: flex-start;
		}

		.menu-toggle {
			display: none;
		}

		.mobile-nav {
			display: none;
		}

		.desktop-nav {
			display: block;
			border: none;
			background: transparent;
		}

		.desktop-nav nav {
			background: transparent;
			justify-content: flex-end;
		}

		ul {
			flex-direction: row;
			flex-wrap: wrap;
			padding: 0;
			width: auto;
			justify-content: flex-end;
		}

		li {
			border-bottom: none;
			white-space: nowrap;
		}

		li[aria-current='page']::before {
			left: calc(50% - var(--size));
			top: auto;
			bottom: calc(1.3 * var(--size));
			border: var(--size) solid transparent;
			border-top: var(--size) solid var(--accent);
		}

		nav a {
			display: flex;
			align-items: center;
			padding: 0.5rem 0.75rem;
			font-size: 0.85rem;
			color: white;
		}

		nav a:hover {
			background: transparent;
		}
	}

	@media (min-width: 1024px) {
		.mainTitle h1 {
			font-size: 2.25rem;
		}

		.mainTitle p {
			font-size: 1.1rem;
		}

		nav a {
			font-size: 0.9rem;
			padding: 0.5rem 1rem;
		}
	}
</style>
