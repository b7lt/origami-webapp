import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { query, searchType = 'both' } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    let stockResults = [];
    // let cryptoResults = [];

    let cryptoResults = [
      {name: "Bitcoin", symbol: "BTC", id: 1, market_cap_rank: 5}
    ];
    
    // Search for stocks if requested
    if (searchType === 'both' || searchType === 'stocks') {
      const yahooResults = await yahooFinance.search(query);
      
      // Filter results to include only stocks and ETFs
      stockResults = yahooResults.quotes
        .filter(quote => 
          quote.quoteType === 'EQUITY' || 
          quote.quoteType === 'ETF'
        )
        .slice(0, 5); // Limit to 5 stock results
    }
    
    
    return res.status(200).json({ 
      stocks: stockResults,
      cryptos: cryptoResults
    });
  } catch (error) {
    console.error('Error searching assets:', error);
    return res.status(500).json({ error: 'Failed to search assets' });
  }
}