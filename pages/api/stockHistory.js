// pages/api/stockHistory.js
import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { stock, range } = req.body;

  if (!stock) {
    return res.status(400).json({ error: 'Stock ticker is required' });
  }

  try {
    const endDate = new Date();
    let startDate = new Date();
    let interval = '1d';

    // different ranges should have different intervals between points
    // so we are going to calculate them here
    switch(range) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        interval = '5m';
        break;
      case '5d':
        startDate.setDate(startDate.getDate() - 5);
        interval = '15m';
        break;
      case '1mo':
        startDate.setMonth(startDate.getMonth() - 1);
        interval = '1d';
        break;
      case '3mo':
        startDate.setMonth(startDate.getMonth() - 3);
        interval = '1d';
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        interval = '1wk';
        break;
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5);
        interval = '1mo';
        break;
      case 'ytd':
        startDate = new Date(endDate.getFullYear(), 0, 1); // jan 1
        interval = '1d';
        break;
      case 'max':
        startDate = new Date(1970, 0, 1); // unix epoch
        interval = '1mo';
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
        interval = '1d';
    }

    // query yahoo finance chart
    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: interval
    };

    console.log('Yahoo Finance Query Options:', queryOptions);
    
    const result = await yahooFinance.chart(stock, queryOptions);
    
    if (!result || !result.quotes || !Array.isArray(result.quotes)) {
      console.error('Unexpected response structure:', result);
      return res.status(500).json({ error: 'Unexpected response structure from Yahoo Finance' });
    }

    // for formatting date labels, if it's 1 day range then omit the month/day to simplify it
    let dateOptions = {
        hour: '2-digit', 
        minute: '2-digit'
    };
    if(range != "1d")
    {
        dateOptions = {
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            ...dateOptions
        }
    }

    // our actual api output
    const chartData = result.quotes.map(item => ({
      date: new Intl.DateTimeFormat('en-US', dateOptions).format(item.date),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    })).filter(item => item.close !== null);
    

    return res.status(200).json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    
    return res.status(500).json(error);
  }
}