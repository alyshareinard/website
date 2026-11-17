<div class="cra-page">
	<header class="page-head">
		<span class="eyebrow">EU Cyber Resilience Act</span>
		<h1>Software that's ready for the CRA</h1>
		<p class="lead">
			If your business sells software or connected products in the EU, new security rules apply to
			you. I help small teams build and maintain software that meets them, without a big compliance
			department.
		</p>
	</header>

	<section class="card block" aria-labelledby="what-heading">
		<h2 id="what-heading">What is the CRA?</h2>
		<p>
			The Cyber Resilience Act (Regulation (EU) 2024/2847) sets cybersecurity requirements for
			"products with digital elements": software, apps and anything with a network connection that
			is sold in the EU. It applies to manufacturers wherever they are based, so a company outside
			the EU is covered too once its product reaches the EU market.
		</p>
		<p>
			Rules for reporting actively exploited vulnerabilities and serious incidents started on
			11&nbsp;September&nbsp;2026. The remaining requirements apply from 11&nbsp;December&nbsp;2027.
		</p>
	</section>

	<section aria-labelledby="help-heading">
		<div class="section-head">
			<h2 id="help-heading">How I can help</h2>
			<p>Practical engineering work, sized for small teams.</p>
		</div>
		<div class="grid">
			<div class="card">
				<h3>Secure by design</h3>
				<p>
					Build new tools with sensible security defaults, minimal data collection and safe handling
					of credentials and tokens from day one.
				</p>
			</div>
			<div class="card">
				<h3>Dependency tracking</h3>
				<p>
					Keep a clear list of the open-source components in your software (a software bill of
					materials) and watch them for known vulnerabilities.
				</p>
			</div>
			<div class="card">
				<h3>Vulnerability handling</h3>
				<p>
					Set up a way for people to report problems, a process for fixing them, and a habit of
					shipping security updates promptly.
				</p>
			</div>
			<div class="card">
				<h3>Documentation</h3>
				<p>
					Help prepare the technical documentation and user information the CRA expects you to keep
					for each product.
				</p>
			</div>
			<div class="card">
				<h3>Gap review</h3>
				<p>
					Look at an existing app or integration and tell you, in plain language, what is already
					fine and what needs work.
				</p>
			</div>
			<div class="card">
				<h3>Ongoing maintenance</h3>
				<p>
					Updates and monitoring for the support period you commit to, so security fixes don't
					depend on someone remembering.
				</p>
			</div>
		</div>
	</section>

	<section class="card block" aria-labelledby="own-heading">
		<h2 id="own-heading">How I handle security on my own projects</h2>
		<p>
			My demo tools are built to collect as little as possible. The CSV cleaner, for example, runs
			entirely in your browser and uploads nothing. My apps follow the same approach, with a
			published security contact and a vulnerability policy. If you find a security problem in
			anything I publish, my <a href="/security">security and vulnerability reporting policy</a> explains
			how to tell me.
		</p>
	</section>

	<p class="disclaimer">
		This page is general information about my services, not legal advice. Whether and how the CRA
		applies to your product depends on what it is and how you sell it, so please confirm your
		obligations with a qualified legal or compliance adviser. I handle the engineering side.
	</p>

	<div class="actions">
		<a
			class="btn-primary"
			href="/contact?service=CRA%20readiness&message=I%27d%20like%20to%20talk%20about%20CRA%20readiness%20for%20my%20software.#contactForm"
			>Talk about CRA readiness</a
		>
		<a class="btn-secondary" href="/security">Security policy</a>
	</div>
</div>

<style>
	.page-head {
		text-align: center;
		margin: 2rem auto 3rem;
		max-width: 42rem;
	}

	.page-head h1 {
		margin: 0.3rem 0 0.75rem;
	}

	.lead {
		color: var(--text-muted);
		font-size: 1.15rem;
		margin: 0;
	}

	.block {
		margin-bottom: 3rem;
	}

	.block h2 {
		margin-top: 0;
		text-align: left;
	}

	.block p:last-child {
		margin-bottom: 0;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		margin-bottom: 3rem;
	}

	.grid h3 {
		margin: 0 0 0.4rem;
	}

	.grid p {
		margin: 0;
		color: var(--text-muted);
	}

	.disclaimer {
		color: var(--text-muted);
		font-size: 0.9rem;
		max-width: 44rem;
		margin: 0 auto 2rem;
		text-align: center;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}

	@media (min-width: 700px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 960px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
