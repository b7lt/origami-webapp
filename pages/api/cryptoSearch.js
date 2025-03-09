export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { query } = req.body;
  
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }
  
    try {
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      const headers = {
        'Content-Type': 'application/json',
      };
  
      if (apiKey) {
        headers['x-cg-demo-api-key'] = apiKey;
      }
      
      // Use Coingecko's search endpoint
      const response = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
        { headers }
      );
  
      if (!response.ok) {
        throw new Error(`Coingecko API error: ${response.status}`);
      }
  
      const data = await response.json();
  
      // format top 5 so that we can render them in our serach bar
      const cryptoResults = data.coins.slice(0, 5).map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        market_cap_rank: coin.market_cap_rank,
        image: coin.large,
        api_symbol: coin.api_symbol
      }));
  
      return res.status(200).json({ cryptos: cryptoResults });
    } catch (error) {
      console.error('Error searching cryptocurrencies:', error);
      return res.status(500).json({ error: 'Failed to search cryptocurrencies' });
    }
  }