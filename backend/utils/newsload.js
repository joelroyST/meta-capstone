const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fetchAndStoreNewsArticles() {
  const url = "https://nba-latest-news.p.rapidapi.com/articles";
  const options = {
    method: "GET",
    headers: {
      "rapidapi-key": "cbca1b28d7msh153cb400f5cac43p1467e4jsn3649d68c5aaf",
      "x-rapidapi-host": "nba-latest-news.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const articles = await response.json();

    for (const article of articles) {
      await prisma.newsArticle.upsert({
        where: { url: article.url },
        update: {},
        create: {
          title: article.title,
          url: article.url,
          source: article.source,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}
fetchAndStoreNewsArticles();