import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    let stockResults = [];
    
    const yahooResults = await yahooFinance.search(query);
    
    // we don't want other stuff
    stockResults = yahooResults.quotes
      .filter(quote => 
        quote.quoteType === 'EQUITY' || 
        quote.quoteType === 'ETF'
      )
      .slice(0, 5); // limit to 5 results, don't clutter search box
    
    return res.status(200).json({ 
      stocks: stockResults
    });
  } catch (error) {
    console.error('Error searching stocks:', error);
    return res.status(500).json({ error: 'Failed to search stocks' });
  }
}