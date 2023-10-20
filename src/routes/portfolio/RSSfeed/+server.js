import { json } from "@sveltejs/kit";
import Parser from "rss-parser";
export async function GET({url}){
    const rssLink = url.searchParams.get('url');
    const parser = new Parser();
    let feed = await parser.parseURL(rssLink);
    return json(feed);
}