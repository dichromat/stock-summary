// @ts-ignore
import vader from 'vader-sentiment'

export interface Article {
  source: {
    id: string | null;
    name: string| null;
  };
  author: string | null;
  title: string| null;
  description: string;
  url: string | null;
  urlToImage: string | null;
  publishedAt: string | null;
  content: string | null;
}

export interface TaggedArticle extends Article {
  sentiments: VaderResponse
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

// Define an async function to handle the API request
const fetchNews = async (query: string, from: string, to: string): Promise<NewsAPIResponse> => {
  try {
      // Make the API call and await the result
      const apiKey = import.meta.env.VITE_NEWS_API_KEY
      const url = 'https://newsapi.org/v2/everything'

      // Create a query string
      const params = new URLSearchParams({
        q: query,
        searchIn: 'content',
        from: from,
        to: to,
        sortBy: 'relevancy',
        language: 'en',
        apiKey, // append the apiKey
      });

      const response = await fetch(`${url}?${params.toString()}`);
      const data = await response.json();

      // Store the result in a variable
      return data;
  } catch (error) {
      // Handle errors
      console.error('Error fetching news:', error);
      throw error
  }
}

export interface VaderResponse {
  neg: number,
  neu: number,
  pos: number,
  compound: number
}

// Function to analyze sentiment
const analyzeSentiment = (text: string): VaderResponse => {
  try {
    const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    return sentiment;
  }
  catch (error) {
    console.log('Error analyzing sentiment:', error)
    throw error
  }
}

export interface NewsData {
  totalResults: number,
  topFiveItems: TaggedArticle[],
  bottomFiveItems: TaggedArticle[],
  averageSentiment: number
}

const grabNewsData = (news: NewsAPIResponse): NewsData => {
  try {
    const totalResults = news.totalResults

    // Custom type guard to filter out null content
    const isValidArticle = (item: Article): item is Article & { content: string, url: string } => {
      return item.content !== null && item.url !== null;
    };

    const validArticles = news.articles.filter(isValidArticle)
    const taggedArticles: TaggedArticle[]  = validArticles.map((item) => ({...item, "sentiments": analyzeSentiment(item.content)}))
    taggedArticles.sort((a,b) => a.sentiments.compound - b.sentiments.compound)
    
    const topFiveItems = taggedArticles.slice(0,5)
    const bottomFiveItems = taggedArticles.slice(-5)
    console.log(topFiveItems)
    console.log(bottomFiveItems)

    let averageSentiment = 0
    taggedArticles.forEach((item) => {
      averageSentiment += item.sentiments.compound
    })
    averageSentiment /= taggedArticles.length
    return {totalResults, topFiveItems, bottomFiveItems, averageSentiment}
  }
  catch(error) {
    console.log('Error getting news data:', error)
    throw error
  }
  

}

export const getNewsData = async (query: string, from: string, to: string): Promise<NewsData>  => {
  const news = await fetchNews(query, from, to);
  const data = grabNewsData(news);
  return data
}






