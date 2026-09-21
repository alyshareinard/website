<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/fav_logo.png';

	let menuOpen = $state(false);

	const navItems = [
		{ label: 'Work', href: '/portfolio' },
		{ label: 'Games', href: '/games' },
		{ label: 'About', href: '/about' },
		{ label: 'Services', href: '/contact' }
	];

	function isCurrent(href) {
		const path = $page.url.pathname;
		return path === href || path.startsWith(href + '/');
	}

	function closeMenu() {
		menuOpen = false;
	}
</script>

<header>
	<div class="bar">
		<a class="brand" href="/" onclick={closeMenu} aria-label="Tech-Aly home">
			<img src={logo} alt="" />
			<span>Tech-Aly</span>
		</a>

		<nav aria-label="Main">
			<ul class="desktop">
				{#each navItems as item}
					<li>
						<a href={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}
							>{item.label}</a
						>
					</li>
				{/each}
				<li>
					<a class="btn-primary nav-cta" href="/contact#contactForm">Get in touch</a>
				</li>
			</ul>
		</nav>

		<button
			class="menu-toggle"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label="Toggle navigation"
			aria-expanded={menuOpen}
			aria-controls="mobile-nav"
		>
			<span class="hamburger" class:open={menuOpen}></span>
		</button>
	</div>

	<nav id="mobile-nav" class="mobile" class:open={menuOpen} aria-label="Mobile">
		<ul>
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						onclick={closeMenu}
						aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label}</a
					>
				</li>
			{/each}
			<li>
				<a class="btn-primary" href="/contact#contactForm" onclick={closeMenu}>Get in touch</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(10, 18, 20, 0.78);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border);
	}

	.bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: var(--content-width);
		margin: 0 auto;
		padding: 0.6rem 1.25rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		text-decoration: none;
		color: var(--text);
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.15rem;
		letter-spacing: -0.01em;
	}

	.brand:hover {
		color: var(--text);
	}

	.brand img {
		width: 2.4rem;
		height: 2.4rem;
		object-fit: contain;
		border-radius: 8px;
		background: white;
		padding: 2px;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.desktop {
		display: none;
		align-items: center;
		gap: 0.25rem;
	}

	nav a:not(.btn-primary) {
		display: block;
		padding: 0.5rem 0.9rem;
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.95rem;
		border-radius: 999px;
		transition:
			color 0.2s ease,
			background 0.2s ease;
	}

	nav a:not(.btn-primary):hover {
		color: var(--text);
		background: rgba(255, 255, 255, 0.06);
	}

	nav a[aria-current='page'] {
		color: var(--mainThemeLighter);
		background: rgba(80, 230, 230, 0.1);
	}

	.nav-cta {
		margin-left: 0.5rem;
		padding: 0.5rem 1.1rem;
		font-size: 0.92rem;
	}

	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.6rem;
		height: 2.6rem;
		margin: 0;
		padding: 0;
		background: transparent;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-sm);
	}

	.menu-toggle:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.hamburger,
	.hamburger::before,
	.hamburger::after {
		display: block;
		width: 1.25rem;
		height: 2px;
		background: var(--text);
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

	.mobile {
		display: none;
		border-top: 1px solid var(--border);
		padding: 0.5rem 1.25rem 1rem;
	}

	.mobile.open {
		display: block;
	}

	.mobile ul {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.mobile a:not(.btn-primary) {
		padding: 0.75rem 0.5rem;
		font-size: 1.05rem;
	}

	.mobile .btn-primary {
		justify-content: center;
		margin-top: 0.5rem;
	}

	@media (min-width: 768px) {
		.desktop {
			display: flex;
		}

		.menu-toggle,
		.mobile {
			display: none !important;
		}
	}
</style>
