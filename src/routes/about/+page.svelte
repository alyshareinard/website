
<script>
    import { Accordion} from '$lib/components/Accordion';
    let startOpen=true;
</script>


<h1>About Me</h1>

<p class="darkBackground">From solar physics to tech guru to  developer, my career has spanned many areas, 
but I've always gravitated towards solving puzzles and finding or creating better 
ways to do things. Growing up in the years before smart phones and apps for everything, I learned 
technology as it appeared, which often required writing code to make things work.  
Because of that I'm very comfortable with how computers "think" and I'm able to 
quickly work through and around typical issues and build the best tool to solve the problem at hand.
</p>
<Accordion startOpen=true>
    <span slot="head">
<h2> Current focus: building apps and tools, working with APIs, creating custom integrations (2022-present) </h2>
</span>
<div slot="details">
<h4>
After a few years of working in a variety of different tech spaces, I've decided to focus on building apps and tools, 
as well as integrations between different platforms.  This lets me worry less about the details and syntax of how each platform works
so I can spend more time solving the problem at hand with the tools and code I'm most comfortable with -- Python/Streamlit and Svelte.
I've detailed a few recent projects in the <a href="/portfolio">portfolio section</a>.

</h4>
</div>
</Accordion>

<hr/>
<Accordion >
<span slot="head">
<h2> Consulting (2018-2022)</h2>
</span>

<div slot="details">
<h4>After moving to Switzerland in 2017 I spent a bit of time working remotely for the University of Colorado, finishing up a few projects.  
    Then I worked with several startups, being the "all things tech" person -- writing code, building workflows, integrating different apps to work together.   
    I also helped them build their websites and create custom tools to help them run their business.  
</h4>
<h4>
    Some examples:
</h4>
<h4> 
    I worked quite a bit with Airtable (I still do) and I used it to build a scheduling app for a business so they could easily 
    see which employees were available when they were scheduling appointments.  I also used Airtable to build a system for a gym, 
    where each trainer had a separate base/table to keep track of their clients and sessions.  Summaries of each trainer were 
    then automatically fed into a main table which the gym owner could see as a report.  
</h4>
<h4>
    I did a few projects using Zapier to connect different apps together. For example, a client used Eventbrite to host events 
    and they wanted those attendees added as Hubspot contacts, along with a record of which events the contact had attended.  I set 
    up this integration using Zapier and Hubspot workflows.  
</h4>
<h4>
I also worked directly with the Hubspot API, which allowed more flexibility in adding data to Hubspot. One big use for this was 
helping clients move from another platform to Hubspot.  It's usually easy to transfer your contacts, but harder to transfer meetings
calls, notes, and other data.  I was able to move all those events directly using the Hubspot API so that the transfer was seamless.  
</h4>
</div>
</Accordion>
<hr/>
<Accordion>
<span slot="head">
<h2>My sordid past as a solar physicist (before 2018)</h2>
</span>
<div slot="details">
    <h4>
        I worked for several years as a solar physicist at the University of Colorado in Boulder.  
        My scientific career was focused on improving our understanding of solar storms (flares and coronal mass ejections) and our ability to predict the impacts of those events on the Earth.
        Though they're not well known, these solar storms can cause issues for satellites, power grids, airline communications, and a host of other industries.  
        Accurate predictions of these events can save significant time and money.

    </h4>
<h4>
        The work actually wasn't all that different than what I do now. I wrote code to download data and then wrote more code to analyze and find patterns in the data.
        I built tools to help me sort through the data and look for patterns.  Then I created visualizations to show the results, gave presentations and wrote papers.
        It was the coding and tool making that I enjoyed the most. As I grew in my career, my work transitioned to managing people
        and projects. And as science funding declined, I spent more and more time writing grant proposals.  I was good at both management 
        and writing, but I didn't really enjoy either. #ratherBeCoding The opportunity came to move to Switzerland and I took it. 
        
    </h4>
<h4>

        If you'd like to read about my career in solar physics, I've put some details <a href = "about/science">here</a>.

    </h4>
</div>
</Accordion>

<hr/>
<Accordion>
<span slot="head">
<h2>Beyond coding</h2>
</span>
<span slot="details">
    <h4>I grew up in Wyoming and the Pacific Northwest and spent a good part of my adult life in Colorado.  
    I moved to Switzerland in 2017 with my family (my wife is Swiss).  I always say, as long as I'm near the mountains, I'm happy.
    </h4>
<h4>
    In my free time I like to play video games (e.g. Oxygen not included, Factorio, currently Dysmantle), run, and take on crazy projects 
    like <a href = "about/beyond/desk">building a desktop out of old wine crates</a>.
    </h4>
    <h4>
    I also volunteer at a local second hand shop, <a  href="https://csp.ch/vaud/galetas-et-boutiques/">Les Galetas</a>, which lets me practice my French and give back to the community.  
    The proceeds from the shop go to help those in the community who can't afford legal services.
</h4>
</span>
</Accordion>

<style>
    a{
        color:var(--mainTheme)
    }
    h4 {
        color:var(--mainThemeDark);
        font-weight: 400;
        
    }
    hr {
        width:80%
    }


</style>
