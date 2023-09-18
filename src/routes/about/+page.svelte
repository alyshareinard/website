
<script>
    import { Accordion} from '$lib/components/Accordion';
    let startOpen=true;
</script>

<h1>About Me</h1>

From solar physics to tech guru to app building, my career has spanned many areas, 
but I've always gravitated towards solving puzzles and finding or creating better 
ways to do things. Growing up in the years before smart phones and apps for everything, I learned 
technology as it appeared, which often required writing code to make things work.  
Because of that I'm very comfortable with how computers "think" and I'm able to 
quickly work through and around typical issues and build the best tool to solve the problem at hand.

<Accordion open={startOpen}>
    <span slot="head">
<h2> Current focus: building apps and tools, working with APIs, creating custom integrations (2022-present) </h2>
</span>
<div slot="details">

<h3>Inventory and payroll system</h3>
<h4>Created a full inventory and payroll system for a door-to-door sales business that worked with their existing sales app.  
    The new app allowed the company to easily record shipments from the supplier, products checked out to sales representatives, and items sold to customers.  
    Items sold would then be added to the payroll system where base salary, commission and monthly bonuses would be calculated.  
    Once approved the system would email the employee a PDF summarizing their payroll record.
</h4>
<h4>Techstack: Backendless, React, Javascript</h4>

    <h3> Shipping info from tracking API to Purchase Order record</h3>
    <h4>Created middleware to update SKU.io (an inventory/purchase order tracker) with expected delivery 
        date from the AfterShip API (a shipping tracker).  Using Retool, I created a webhook from SKU.io 
        to receive new purchase orders, add the associated tracking numbers to the AfterShip tracker.  Retool was also used to 
        catch the webhooks from AfterShip indicating a change in order status and update the SKU.io record.  Previously this client 
        had been looking up each tracking number daily and updating the SKU.io record manually, so the new system saved a significant amount of time.
    </h4>
    <h4>Techstack: Retool, Javascript</h4>
    <h3>
    Simple app to pull the email addresses of all Hubspot contacts who work for companies associated with a given keyword.
    </h3>
    <h4>A client was providing direct marketing incentives to certain subgroups of clients.  
        They used Hubspot to track target companies and their associated interests using keywords associated with the companies.  
    However, to send out their marketing email they had to find all companies associated with a given keyword, and then, by hand 
        go through each of the company employees and pull their email addresses.  I built a simple app that worked with the Hubspot 
        API to complete this process automatically.  Using my app the client now just types in a keyword and is provided a list of all relevant contacts.  
</h4>
    <h4>Techstack: Python, Streamlit</h4>
    <h3>
        I worked with a company that relied on external reviews to evaluate products and provide feedback and ratings.  
        The manual process involved manually tracking the list of products, how many reviews had been requested for each, 
        as well as tracking the list of reviewers and which products they had already reviewed. Different products required a 
        different number of reviews and the reviewers finished their work at different speeds.  This process became 
        unworkable as the company grew.  I created an app using Airtable to track products, reviewers, and reviews. I build a front-end using 
        Streamlit that allowed the reviewers to log in, see reviews they had done and request additional products to review.  
</h3>
<h4>Techstack: Airtable, Python, Streamlit</h4>
<h3>

    Transition all data, including meetings and notes from various CRMs to Hubspot
</h3>
<h4>
    I've worked with several companies to transfer their data between different CRMs (Customer relations managers).  
    Tools exist that allow contacts and companies to be transfered easily, but this doesn't include meetings, notes, and other data.  
    I have several python scripts that allow me to pull all this data and import it into Hubspot.
</h4>
<h4>Techstack: Python, Hubspot API</h4>

</div>
</Accordion>

<hr/>
<Accordion >
<span slot="head">
<h2> Consulting (2018-2022)</h2>
</span>

<div slot="details">

    I worked with several startups to help them build their tech stack and create custom integrations between their tools.  I also helped them build their websites and create custom tools to help them run their business.
    <br>
    Scheduling app using Airtable and Zapier
<br>
    Airtable projects
    <br>

Zapier
<br>
Hubspot

</div>
</Accordion>
<hr/>
<Accordion>
<span slot="head">
<h2>My sordid past as a solar physicist (before 2018)</h2>
</span>
<div slot="details">
    
        My scientific career was focused on improving our understanding of solar storms and our ability to predict the impacts of those events on the Earth.

    <br>
        The work actually wasn't all that different than what I do now. I wrote code to download data and then wrote more code to analize and find patterns in the data.
        I built tools to help me sort through the data and pull out what was interesting.  Then I created visualizations to show the results, gave presentations and wrote papers.
        It was the coding and tool making that I enjoyed the most.  
        <ul>
            <li>If you'd like to read about my career in solar physics: <a href = "about/science">Rocket science</a></li>
        </ul>
</div>
</Accordion>

<style>
    h3{
        color:var(--mainTheme)
    }
    h4 {
        color:var(--mainThemeDark)
    }


</style>
