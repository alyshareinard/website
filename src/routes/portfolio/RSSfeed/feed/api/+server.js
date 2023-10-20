import Parser from "rss-parser";
export const GET = async(myurl) =>  {
//    const response = await fetch(file)

    const parser = new Parser();
    let feed = await parser.parseURL(myurl);
    return {...feed};
}