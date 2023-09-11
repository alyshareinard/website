
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

    Inventory and payroll system
<br>
    Shipping info from API to retool
    <br>
    Simple app to pull the email addresses of all hubspot contacts who work for companies associated with a given keyword -- I've created a toy version of this in my portfolio
    <br>
    App to assign pages to reviewers
    <br>
    transition all data from pipedrive to hubspot, including meetings and notes -- working with Hubspot API

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

