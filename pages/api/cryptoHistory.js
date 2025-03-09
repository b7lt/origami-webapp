export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { coinId, range } = req.body;
  
    if (!coinId) {
      return res.status(400).json({ error: 'Coin ID is required' });
    }
  
    try {
      const endDate = Math.floor(Date.now() / 1000); // right now, in seconds
      let startDate;
      let interval;
  
      // calc start date and set proper interval
      // remember that dates are in seconds, so do second calculations
      const oneDayInSecs = 24*60*60;
      switch (range) {
        case '1d':
          startDate = endDate - oneDayInSecs;
          interval = 'minute'; // 5 min
          break;
        case '5d':
          startDate = endDate - 5*oneDayInSecs;
          interval = 'minute'; // 15 min
          break;
        case '1mo':
          startDate = endDate - 30*oneDayInSecs;
          interval = 'hourly';
          break;
        case '3mo':
          startDate = endDate - 90*oneDayInSecs;
          interval = 'daily';
          break;
        case '1y':
          startDate = endDate - 365*oneDayInSecs;
          interval = 'daily';
          break;
        case '5y':
          startDate = endDate - 5*365*oneDayInSecs;
          interval = 'daily';
          break;
        default:
          startDate = endDate - 30*oneDayInSecs;
          interval = 'hourly';
      }
  
      let apiUrl;
      if (interval === 'minute') {
        // params change based on interval
        if (range === '1d') {
          apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=5m`;
        } else {
          apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=5&interval=15m`;
        }
      } else if (interval === 'hourly') {
        apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`;
      } else {
        // calc max days, for daily interval
        const days = Math.ceil((endDate - startDate) / (oneDayInSecs));
        apiUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
      }
  
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      const headers = {
        'Content-Type': 'application/json',
      };
  
      if (apiKey) {
        headers['x-cg-demo-api-key'] = apiKey;
      }
      
      const response = await fetch(apiUrl, { headers });
  
      if (!response.ok) {
        throw new Error(`Coingecko API error: ${response.status}`);
      }
  
      const data = await response.json();
  
      // formatting our actual output
      let dateOptions = {
        hour: '2-digit',
        minute: '2-digit'
      };
  
      // if range is bigger than 1 day, include year/month/day
      if (range !== '1d') {
        dateOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          ...dateOptions
        };
      }
  
      // formatting again to support our already-existing StockChart component!
      const chartData = data.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        return {
          date: new Intl.DateTimeFormat('en-US', dateOptions).format(date),
          close: price,
          price: price
        };
      });
  
      return res.status(200).json(chartData);
    } catch (error) {
      console.error('Error fetching crypto history data:', error);
      return res.status(500).json({ error: 'Failed to fetch crypto history data' });
    }
  }