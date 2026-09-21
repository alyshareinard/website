import type { Post } from './score';

// Made-up freelance job posts, newest first (the order they "arrived").
export const SAMPLE_POSTS: Post[] = [
	{
		id: 'p1',
		title: 'Automate weekly invoices from Airtable to QuickBooks',
		source: 'Freelance marketplace',
		daysAgo: 0,
		description: `We track jobs in Airtable and re-type every invoice into QuickBooks each Friday. We'd like an automation that uses the API to create invoices for us.
Budget: $900 fixed
Skills: Airtable, QuickBooks, API, automation`
	},
	{
		id: 'p2',
		title: 'WordPress theme tweaks for a restaurant website',
		source: 'Agency board',
		daysAgo: 0,
		description: `A few small CSS fixes to our WordPress theme: menu spacing, mobile header, footer links.
Budget: $150 fixed
Skills: WordPress, CSS`
	},
	{
		id: 'p3',
		title: 'Python script to pull Shopify orders into Google Sheets',
		source: 'Freelance marketplace',
		daysAgo: 1,
		description: `Every morning we export orders from Shopify by hand. We want a Python script that runs on a schedule and appends new orders to a Google Sheet.
Budget: $600 fixed
Skills: Python, Shopify API, Google Sheets`
	},
	{
		id: 'p4',
		title: 'HubSpot CRM migration from Pipedrive (contacts, notes, meetings)',
		source: 'Agency board',
		daysAgo: 1,
		description: `We are moving 6,000 contacts and their history from Pipedrive to HubSpot. Notes and meetings need to come across too, not only contacts and companies.
Budget: $1,500 fixed
Skills: HubSpot, Python, API`
	},
	{
		id: 'p5',
		title: 'Design a logo for a craft brewery',
		source: 'Freelance marketplace',
		daysAgo: 1,
		description: `We are opening a small brewery and need a logo, a label design and a simple colour palette.
Budget: $400 fixed
Skills: Logo design, Illustrator`
	},
	{
		id: 'p6',
		title: 'SEO blog writer needed, 10 posts per month',
		source: 'Content board',
		daysAgo: 2,
		description: `Looking for a writer who understands SEO to produce ten 1,000-word posts per month about home gardening.
Budget: $50 per post
Skills: SEO, copywriting`
	},
	{
		id: 'p7',
		title: 'Internal dashboard in Retool connected to Postgres',
		source: 'Freelance marketplace',
		daysAgo: 2,
		description: `Our support team needs a Retool dashboard on top of our Postgres database, with a few buttons that call our API to refund or resend orders.
Budget: $2,000 fixed
Skills: Retool, SQL, API`
	},
	{
		id: 'p8',
		title: 'Data entry: copy 500 records from PDFs into a spreadsheet',
		source: 'Freelance marketplace',
		daysAgo: 3,
		description: `We have 500 scanned forms that need to be typed into a spreadsheet.
Budget: $120 fixed
Skills: Data entry, attention to detail`
	},
	{
		id: 'p9',
		title: 'Zapier expert to connect Typeform, Slack and Mailchimp',
		source: 'Agency board',
		daysAgo: 3,
		description: `When someone fills in our Typeform we want a Slack message and a Mailchimp subscriber. Happy to hear if there is a better way to do this automation.
Budget: $300 fixed
Skills: Zapier, Slack, Mailchimp`
	},
	{
		id: 'p10',
		title: 'React front end for our booking API',
		source: 'Freelance marketplace',
		daysAgo: 4,
		description: `Our booking API is ready and documented. We need a clean React front end that lets customers pick a time and pay.
Budget: $3,500 fixed
Skills: React, API, Stripe`
	},
	{
		id: 'p11',
		title: 'Streamlit app so reviewers can request products (Airtable backend)',
		source: 'Freelance marketplace',
		daysAgo: 5,
		description: `We manage product reviewers in a spreadsheet and it no longer works. We want an Airtable base with a simple Python Streamlit front end where reviewers log in, see past reviews and request new products.
Budget: $2,500 fixed
Skills: Airtable, Python, Streamlit, automation`
	},
	{
		id: 'p12',
		title: 'Fix my WordPress site, it is very slow',
		source: 'Agency board',
		daysAgo: 5,
		description: `Our WordPress site takes ten seconds to load. Need someone to find out why and fix it.
Budget: $200 fixed
Skills: WordPress, performance`
	},
	{
		id: 'p13',
		title: 'Clean up and merge three CSV exports every week',
		source: 'Freelance marketplace',
		daysAgo: 6,
		description: `Three different tools give us CSV exports with different column names and phone formats. We want one clean file each Monday, ideally with no manual steps. Python or any automation tool is fine.
Budget: $700 fixed
Skills: Python, CSV, automation`
	},
	{
		id: 'p14',
		title: 'Build a mobile app like Uber for dog walking',
		source: 'Freelance marketplace',
		daysAgo: 7,
		description: `We want the next big thing in dog walking, with maps, payments, ratings and chat.
Budget: $500 fixed
Skills: iOS, Android, maps`
	},
	{
		id: 'p15',
		title: 'Automation of onboarding emails with Make and Google Sheets',
		source: 'Newsletter',
		daysAgo: 8,
		description: `New clients are added to a Google Sheet. We want a welcome email sequence to start automatically and a row updated when each email is sent.
Budget: $450 fixed
Skills: Make, Google Sheets, automation`
	}
];

export const DEFAULT_PLUS = ['airtable', 'automation', 'API', 'python'];
export const DEFAULT_MINUS = ['WordPress', 'logo', 'SEO', 'data entry'];
export const DEFAULT_DETAILS = ['Budget', 'Skills'];
