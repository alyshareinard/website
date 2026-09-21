// Client work. `summary` is the short version for the home page; `description` is the full write-up
// shown on the portfolio page.
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const clientProjects = [
	{
		title: 'Business Central ↔ VisualFactory',
		summary:
			'Syncs assembly orders and parts data between inventory and shop-floor instructions, with no manual entry.',
		description:
			'Built a full automation pipeline using custom AL code and secure API connections to sync assembly orders and parts data between Microsoft Business Central (inventory) and VisualFactory (shop-floor assembly instructions), eliminating manual entry and ensuring accurate, real-time inventory updates across systems.',
		stack: ['Business Central AL', 'OAuth 2.0', 'REST APIs']
	},
	{
		title: 'VisualFactory → Windchill (FRACAS intake)',
		summary:
			'Shop-floor defect reports flow into Windchill automatically, validated, transformed and audit-logged.',
		description:
			'Delivered an automated path from shop-floor issue reporting in VisualFactory into Windchill by standardizing the handoff into Windchill’s FRACAS-compatible import format. Implemented a reliable “generate → deliver → validate → transform → import” pipeline: VisualFactory produces structured defect reports (CSV/XML), routes them through a dedicated Microsoft 365 mailbox, and an internal scheduled automation retrieves and validates attachments via Microsoft Graph, archives processed inputs, transforms them into Windchill-compliant FRACAS XML, and imports them using Windchill’s standard XML import interface, complete with audit logging and secure credential handling.',
		stack: ['VisualFactory', 'Windchill', 'Microsoft Graph', 'XML']
	},
	{
		title: 'Inventory & payroll system',
		summary:
			'Shipments, rep checkouts, sales and commissions in one place, with emailed PDF pay stubs.',
		description:
			'Created a full inventory and payroll system for a door-to-door sales business that worked with their existing sales app. The new app allowed the company to easily record shipments from the supplier, products checked out to sales representatives, and items sold to customers. Items sold would then be added to the payroll system where base salary, commission and monthly bonuses would be calculated. Once approved the system would email the employee a PDF summarizing their payroll record.',
		stack: ['Backendless', 'React', 'JavaScript']
	},
	{
		title: 'Shipping tracker integration',
		summary:
			'Delivery dates from AfterShip land in SKU.io purchase orders, replacing daily tracking-number lookups.',
		description:
			'Created middleware to update SKU.io (an inventory/purchase order tracker) with expected delivery date from the AfterShip API (a shipping tracker). Using Retool, I created a webhook from SKU.io to receive new purchase orders, add the associated tracking numbers to the AfterShip tracker. Retool was also used to catch the webhooks from AfterShip indicating a change in order status and update the SKU.io record. Previously this client had been looking up each tracking number daily and updating the SKU.io record manually, so the new system saved a significant amount of time.',
		stack: ['Retool', 'JavaScript']
	},
	{
		title: 'Product reviewer management',
		summary:
			'An Airtable-backed system with a Streamlit front end replaced a spreadsheet for managing reviewers.',
		description:
			'I worked with a company that relied on external reviewers to evaluate products and provide feedback and ratings. The process involved manually tracking the list of products and number of reviews requested for each, as well as tracking the list of reviewers and which products they had already evaluated. This manual process became unworkable as the company grew. I created an app using Airtable to track products, reviewers, and reviews. I built a front end using Streamlit that allowed the reviewers to log in, see reviews they had done and request additional products to review.',
		stack: ['Airtable', 'Python', 'Streamlit']
	},
	{
		title: 'HubSpot keyword contact finder',
		summary:
			'Type a keyword, get every contact at matching companies, replacing a manual company-by-company search.',
		description:
			'A client was providing direct marketing incentives to certain subgroups of clients. They used Hubspot to track target companies and their associated interests using keywords associated with the companies. However, to send out their marketing email they had to find all companies associated with a given keyword, and then, by hand go through each of the company employees and pull their email addresses. I built a simple app that worked with the Hubspot API to complete this process automatically. Using my app the client now just types in a keyword and is provided a list of all relevant contacts.',
		stack: ['Python', 'Streamlit', 'HubSpot API']
	},
	{
		title: 'CRM migrations to HubSpot',
		summary: 'Meetings, notes and other history moved across, not just contacts and companies.',
		description:
			"I've worked with several companies to transfer their data between different CRMs (Customer Relationship Managers). Tools exist that allow contacts and companies to be transferred easily, but this doesn't include meetings, notes, and other data. I have several Python scripts that allow me to pull all this data and import it into Hubspot.",
		stack: ['Python', 'HubSpot API']
	}
];

export const projects = clientProjects.map((project) => ({ ...project, slug: slugify(project.title) }));

// Multiplayer browser games. They run on their own servers (Socket.IO), so these link out.
export const games = [
	{
		id: 'keesh',
		title: 'Keesh',
		tagline: 'A memory-and-mischief card game for friends, playable in any browser.',
		description:
			"A web version of our group's card game. Peek at your cards, spy on other players, swap blind or swap after a look, snap a card you know is a match, and call “Keesh” at just the right moment. Create a table, share the room code, and everyone can join from their phone or laptop.",
		highlights: [
			'Peek, spy and swap actions',
			'Snap other players’ cards, with a penalty if you guess wrong',
			'Create a table and share a room code',
			'Works on iPhone, Android and desktop'
		],
		players: 'Multiplayer, in any browser',
		stack: ['SvelteKit', 'Socket.IO', 'Tailwind'],
		link: 'https://keesh-production.up.railway.app/',
		cta: 'Play Keesh'
	},
	{
		id: 'mahjong',
		title: 'Mahjong',
		tagline: 'Hong Kong-style mahjong for four, with help for people still learning.',
		description:
			'A casual, East-round-only version of Hong Kong-style mahjong with the full 144-tile set, chi, pong and kong claims, and fan scoring. Learning and Hint modes underline useful tiles and show how far you are from named hands, and a Learn Scoring page teaches scoring with puzzles. Short a player or two? Add practice seats.',
		highlights: [
			'Regular, Hint and Learning modes',
			'Special Hands reference built into the game',
			'Learn Scoring puzzles',
			'Reconnects you to your seat if your connection drops'
		],
		players: 'Four players (practice seats fill empty chairs)',
		stack: ['SvelteKit', 'Socket.IO', 'Tailwind'],
		link: 'https://mahjong-production-5d1d.up.railway.app/',
		cta: 'Play Mahjong',
		support: {
			label: 'Learn scoring',
			href: 'https://mahjong-production-5d1d.up.railway.app/learn-scoring'
		}
	}
];

// Phone apps
export const apps = [
	{
		title: 'What the Gender',
		description: 'An iPhone app for French learners to practise and memorize noun genders.',
		link: 'https://www.what-the-gender.com/',
		cta: 'Learn more'
	},
	{
		title: 'WBB Points Check',
		description:
			'A fast, game-time iPhone app for wheelchair basketball coaches and players to build lineups and substitutions.',
		link: 'https://apps.apple.com/us/app/wbb-points-check/id6757154460',
		cta: 'Get the app'
	}
];

// Small working demos of the kind of tool I build for clients
export const demos = [
	{
		title: 'Spotify Playlist Generator',
		description: 'Mix and match your Spotify playlists.',
		link: '/portfolio/spotifyPlaylistMix'
	},
	{
		title: 'CSV formatter',
		description: 'Upload a CSV file, then download it in a different format.',
		link: '/portfolio/csvUpdater'
	},
	{
		title: 'Better RSS feed',
		description:
			'Select feeds, prioritize certain words or phrases, and see the most relevant stories first.',
		link: '/portfolio/RSSfeed'
	}
];

export const testimonials = [
	{
		quote:
			'Alysha delivered exceptional work in a short period of time. Her communication skills were excellent and she was very responsive throughout the project. When I went to Alysha with my workflow issue, she was able to suggest multiple ways to help me achieve my goal. Alysha was pleasant to work with and I would gladly hire her for future automation jobs. She would be an excellent choice for any automation projects you may have.',
		author: 'Shane Price',
		role: 'Freelance Web Designer/Developer'
	},
	{
		quote:
			'I have worked with Alysha on three different projects and each time she has met and exceeded expectations. Each project required ingenuity from Alysha and she provided different options and pros/cons for each in order to achieve our desired outcome. Alysha is both easy and enjoyable to work with and I will continue to hire her for future projects.',
		author: 'Allison Pescatore',
		role: 'Marketing Manager, InvestEd'
	}
];

export const shortReviews = [
	'Alysha helped us to improve the Airtable process. Recommend!',
	'Alysha was amazing to work with! Very knowledgable and professional.',
	'Knows the info, gets the job done. Highly recommend and will work with again.'
];
