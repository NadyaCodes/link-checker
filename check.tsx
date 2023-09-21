import axios from "axios";
import cheerio from "cheerio";

async function checkBrokenLinks(url: string) {
  try {
    // Fetch the web page HTML content
    const response = await axios.get(url);

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Find all anchor <a> elements
    $("a").each(async (index, element) => {
      const link = $(element).attr("href");

      if (link) {
        // Check if the link is an absolute URL or a relative path
        const absoluteLink = new URL(link, url).toString();

        try {
          // Attempt to fetch the link
          await axios.head(absoluteLink);
          console.log(`Link ${absoluteLink} is working.`);
        } catch (error) {
          console.error(`Broken link found: ${absoluteLink}`);
        }
      }
    });
  } catch (error) {
    console.error(`Error fetching the web page: ${error.message}`);
  }
}

// Replace 'https://example.com' with the URL you want to check
const targetUrl = "https://example.com";

checkBrokenLinks(targetUrl);
