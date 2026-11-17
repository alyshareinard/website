<script>
	const securityEmail = 'security@tech-aly.com';
</script>

<div class="security-page">
	<header class="page-head">
		<span class="eyebrow">Security</span>
		<h1>Security and vulnerability reporting</h1>
		<p class="lead">
			If you think you've found a security problem in software published by Tech-Aly, please tell
			me. I'd much rather hear about it privately first.
		</p>
	</header>

	<section class="card" aria-labelledby="report-heading">
		<h2 id="report-heading">How to report</h2>
		<p>
			Email <a href={`mailto:${securityEmail}?subject=Security%20report`}>{securityEmail}</a> with
			the subject "Security report". The same contact details are published in
			<a href="/.well-known/security.txt">security.txt</a>.
		</p>
		<p>Helpful things to include:</p>
		<ul>
			<li>Which app, page or tool is affected, and its address or version if you know it</li>
			<li>What you found and the steps to reproduce it</li>
			<li>What you think the impact is</li>
			<li>How to reach you, if you'd like updates</li>
		</ul>
		<p>
			Please don't include real personal data in your report, and don't send anything sensitive by
			email that isn't needed to reproduce the problem. If you'd like to share something sensitive,
			say so in your first message and we'll agree a safer way.
		</p>
	</section>

	<section class="card" aria-labelledby="expect-heading">
		<h2 id="expect-heading">What to expect</h2>
		<ul>
			<li>I'll acknowledge your report within 5 working days.</li>
			<li>
				I'll look into it, tell you within 10 working days whether I can reproduce it, and keep you
				updated.
			</li>
			<li>
				I'll let you know when a fix is live. Typical fix times for confirmed vulnerabilities:
				<ul>
					<li>
						Actively exploited or critical: a fix or mitigation as fast as possible, aiming for 7
						days.
					</li>
					<li>Serious: aiming for 30 days.</li>
					<li>Lower risk: in the next regular update, and within 90 days.</li>
				</ul>
			</li>
			<li>
				With your agreement, I'm happy to credit you once the issue is fixed. If you'd rather stay
				anonymous, that's fine too.
			</li>
		</ul>
	</section>

	<section class="card" aria-labelledby="coordinated-heading">
		<h2 id="coordinated-heading">Coordinated disclosure</h2>
		<p>
			Please give me a reasonable chance to fix a problem before sharing details publicly. I'll work
			with you on timing. I won't take action against anyone who reports a vulnerability in good
			faith, avoids harming other people's data or services, and doesn't access more data than
			needed to show the problem.
		</p>
	</section>

	<section class="card" aria-labelledby="updates-heading">
		<h2 id="updates-heading">Security updates</h2>
		<p>
			Security fixes for my own apps are free of charge: you never need to buy anything to get them.
			Where possible they ship separately from feature updates. Fixes to my web tools go live on the
			site, so there's nothing for you to install. For iPhone and Mac apps, security fixes arrive as
			App Store updates. For software I build for clients, the support period and how updates are
			delivered are agreed in the project.
		</p>
		<p>
			I keep the open-source libraries and packages my projects depend on up to date and watch for
			published vulnerabilities in them. If a problem lies in a third-party component, I'll also
			report it to its maintainers.
		</p>
	</section>

	<section class="card" aria-labelledby="notify-heading">
		<h2 id="notify-heading">If something serious happens</h2>
		<p>
			If an actively exploited vulnerability or a serious security incident affects one of my apps,
			I'll report it to the authorities as the EU Cyber Resilience Act requires. I'll also tell
			affected users what happened and how to protect themselves, through App Store release notes,
			an in-app message or email, depending on the app.
		</p>
	</section>

	<section class="card" aria-labelledby="advisories-heading">
		<h2 id="advisories-heading">Security advisories</h2>
		<p>
			When I fix a security vulnerability in one of my apps, I'll publish a short advisory in the
			release notes or on this page, saying what was fixed and which versions are affected.
		</p>
		<p><strong>Published advisories:</strong> none so far.</p>
	</section>

	<section class="card" aria-labelledby="scope-heading">
		<h2 id="scope-heading">Scope</h2>
		<p>This policy covers software published under Tech-Aly:</p>
		<ul>
			<li>Just Three Things (iPhone and Mac) and its backend</li>
			<li>
				<a href="https://www.what-the-gender.com/" rel="noopener">What the Gender</a> and its backend
			</li>
			<li>
				<a
					href="https://apps.apple.com/us/app/wbb-points-check/id6757154460"
					rel="noopener noreferrer">WBB Points Check</a
				>
			</li>
			<li>This website and the demo tools on it, including the games on their own servers</li>
		</ul>
		<p>
			It does not cover third-party services I link to or integrate with (such as Apple, Supabase,
			Spotify, HubSpot or Airtable). Please report problems in those directly to the provider.
		</p>
	</section>

	<section class="card" aria-labelledby="manufacturer-heading">
		<h2 id="manufacturer-heading">Who is responsible</h2>
		<p>The software above is published by:</p>
		<address>
			Alysha Reinard (Tech-Aly)<br />
			Route de Saint-Cergue 24bis #1245<br />
			1260 Nyon<br />
			Switzerland
		</address>
		<p>
			Security contact: <a href={`mailto:${securityEmail}`}>{securityEmail}</a>. General contact:
			<a href="/contact#contactForm">contact form</a>.
		</p>
	</section>

	<p class="note">
		Looking for CRA-ready software for your own business?
		<a href="/cra">See how I can help</a>.
	</p>
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

	.card {
		margin-bottom: 1.25rem;
		max-width: 46rem;
		margin-left: auto;
		margin-right: auto;
	}

	.card h2 {
		margin-top: 0;
		text-align: left;
	}

	.card > :last-child {
		margin-bottom: 0;
	}

	address {
		font-style: normal;
		margin: 0 0 1rem;
	}

	.note {
		text-align: center;
		color: var(--text-muted);
		margin-top: 2rem;
	}
</style>
