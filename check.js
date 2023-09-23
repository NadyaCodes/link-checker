// const axios = require("axios");
// const cheerio = require("cheerio");

// async function checkBrokenLinks(url) {
//   try {
//     // Wait for 2 seconds before fetching the web page HTML content
//     await new Promise((resolve) => setTimeout(resolve, 5000));

//     // Fetch the web page HTML content after the delay
//     const response = await axios.get(url);

//     // Load the HTML content into Cheerio
//     const $ = cheerio.load(response.data);

//     // Find all anchor <a> elements
//     const anchorElements = $("a");

//     for (let index = 0; index < anchorElements.length; index++) {
//       const element = anchorElements[index];
//       const link = $(element).attr("href");

//       if (link) {
//         // Check if the link is an absolute URL or a relative path
//         const absoluteLink = new URL(link, url).toString();

//         try {
//           // Attempt to fetch the link
//           await axios.head(absoluteLink);
//           console.log(`Link ${absoluteLink} is working.`);
//         } catch (error) {
//           console.error(`Broken link found: ${absoluteLink}`);
//         }
//       }
//     }
//   } catch (error) {
//     console.error(`Error fetching the web page: ${error.message}`);
//   }
// }

// // Replace 'https://example.com' with the URL you want to check
// const targetUrl = "https://www.actsingdancerepeat.com/program-finder";

// checkBrokenLinks(targetUrl);

const puppeteer = require("puppeteer");
const axios = require("axios");

async function checkBrokenLinks(url) {
  const brokenLinks = [];

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load" }); // Wait for the entire page to load

    // You can add additional waits or conditions here, depending on your specific page content
    await page.waitForTimeout(5000); // Wait for an additional 5 seconds

    const links = await page.evaluate(() => {
      const anchorElements = document.querySelectorAll("a");
      const linkArray = [];

      anchorElements.forEach((element) => {
        const link = element.getAttribute("href");

        if (link) {
          linkArray.push(link);
        }
      });

      return linkArray;
    });

    for (const link of links) {
      const absoluteLink = new URL(link, url).toString();

      try {
        await axios.head(absoluteLink);
        console.log(`Link ${absoluteLink} is working.`);
      } catch (error) {
        console.error(`Broken link found: ${absoluteLink}`);
        brokenLinks.push(absoluteLink);
      }
    }

    await browser.close();

    return brokenLinks;
  } catch (error) {
    console.error(`Error checking broken links: ${error.message}`);
    return brokenLinks;
  }
}

const targetUrl = "https://www.actsingdancerepeat.com/program-finder";

checkBrokenLinks(targetUrl)
  .then((brokenLinks) => {
    console.log("Broken Links:");
    brokenLinks.forEach((link) => {
      console.log(link);
    });
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
  });
