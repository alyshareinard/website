
<script>
    import { Accordion} from '$lib/components/Accordion';
	import PortfolioCards from '../portfolioCards.svelte';
</script>
<title>Portfolio</title>
<meta name="description" content="Description of past projects and a few simple examples of my work.">

<h1>Portfolio</h1>
<hr/>
<h2>Selected client projects: </h2>
<Accordion>
<span slot="head">
<h3> Inventory and payroll system </h3>
</span>
<div slot="details">

<h4>Created a full inventory and payroll system for a door-to-door sales business that worked with their existing sales app.  
    The new app allowed the company to easily record shipments from the supplier, products checked out to sales representatives, and items sold to customers.  
    Items sold would then be added to the payroll system where base salary, commission and monthly bonuses would be calculated.  
    Once approved the system would email the employee a PDF summarizing their payroll record.
</h4>
<h4>Techstack: Backendless, React, Javascript</h4>
</div>

</Accordion>
<Accordion>
    <span slot="head">
        <h3> Shipping info from tracking API to Purchase Order record</h3>
    </span>
    <div slot="details">
        <h4>Created middleware to update SKU.io (an inventory/purchase order tracker) with expected delivery 
            date from the AfterShip API (a shipping tracker).  Using Retool, I created a webhook from SKU.io 
            to receive new purchase orders, add the associated tracking numbers to the AfterShip tracker.  Retool was also used to 
            catch the webhooks from AfterShip indicating a change in order status and update the SKU.io record.  Previously this client 
            had been looking up each tracking number daily and updating the SKU.io record manually, so the new system saved a significant amount of time.
        </h4>
        <h4>Techstack: Retool, Javascript</h4>

    </div>
</Accordion>


    <Accordion>
        <span slot="head">
            <h3>
                Simple app to pull the email addresses of all Hubspot contacts who work for companies associated with a given keyword.
                </h3>
        </span>
        <div slot="details">
        
    
            <h4>A client was providing direct marketing incentives to certain subgroups of clients.  
                They used Hubspot to track target companies and their associated interests using keywords associated with the companies.  
            However, to send out their marketing email they had to find all companies associated with a given keyword, and then, by hand 
                go through each of the company employees and pull their email addresses.  I built a simple app that worked with the Hubspot 
                API to complete this process automatically.  Using my app the client now just types in a keyword and is provided a list of all relevant contacts.  
        </h4>
            <h4>Techstack: Python, Streamlit</h4>
        </div>
    </Accordion>


    <Accordion>
        <span slot="head">
            <h3>
                Automated system to manage product reviewers
                </h3>
        </span>
        <div slot="details">
            <h4>
                I worked with a company that relied on external reviewers to evaluate products and provide feedback and ratings.  
                The process involved manually tracking the list of products and number of reviews requested for each, 
                as well as tracking the list of reviewers and which products they had already evaluated.  This manual process became 
                unworkable as the company grew.  I created an app using Airtable to track products, reviewers, and reviews. I build a front-end using 
                Streamlit that allowed the reviewers to log in, see reviews they had done and request additional products to review.  
        </h4>
        <h4>Techstack: Airtable, Python, Streamlit</h4>  
    
        </div>
    </Accordion>



<Accordion>
    <span slot="head">
        <h3>

            Transition all data, including meetings and notes from various CRMs to Hubspot
        </h3>
    </span>
    <div slot="details">
        <h4>
            I've worked with several companies to transfer their data between different CRMs (Customer relations managers).  
            Tools exist that allow contacts and companies to be transfered easily, but this doesn't include meetings, notes, and other data.  
            I have several Python scripts that allow me to pull all this data and import it into Hubspot.
        </h4>
        <h4>Techstack: Python, Hubspot API</h4>

    </div>
</Accordion>
<hr/>
<h2>Apps to explore: </h2>

<PortfolioCards/>


<style>
    h4 {
        color:var(--mainThemeDark);
        font-weight: 400;
        
    }
</style>