export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { coinId } = req.body;
  
    if (!coinId) {
      return res.status(400).json({ error: 'Coin ID is required' });
    }
  
    try {
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      const headers = {
        'Content-Type': 'application/json',
      };
  
      if (apiKey) {
        headers['x-cg-demo-api-key'] = apiKey;
      }
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        { headers }
      );
  
      if (!response.ok) {
        throw new Error(`Coingecko API error: ${response.status}`);
      }
  
      const data = await response.json();
  
      // format to match output of stockQuote, will help later on with rendering
      const formattedData = {
        symbol: data.symbol.toUpperCase(),
        shortName: data.name,
        longName: data.name,
        regularMarketPrice: data.market_data.current_price.usd,
        regularMarketChange: data.market_data.price_change_24h,
        regularMarketChangePercent: data.market_data.price_change_percentage_24h,
        marketCap: data.market_data.market_cap.usd,
        regularMarketVolume: data.market_data.total_volume.usd,
        fiftyTwoWeekLow: data.market_data.low_24h.usd, // it doesn't really output this so uhhhh scuffed substitute!
        fiftyTwoWeekHigh: data.market_data.high_24h.usd, // sub
        regularMarketOpen: data.market_data.current_price.usd, // sub
        image: data.image.large,
        marketCapRank: data.market_cap_rank,
        priceChangePercentage7d: data.market_data.price_change_percentage_7d,
        priceChangePercentage30d: data.market_data.price_change_percentage_30d,
        priceChangePercentage1y: data.market_data.price_change_percentage_1y,
        totalSupply: data.market_data.total_supply,
        circulatingSupply: data.market_data.circulating_supply
      };
  
      return res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return res.status(500).json({ error: 'Failed to fetch crypto data' });
    }
  }