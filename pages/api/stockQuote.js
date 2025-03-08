import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { stock } = req.body;
  
    if (!stock) {
      return res.status(400).json({ error: 'Stock ticker is required' });
    }
  
    const stockResult = await yahooFinance.quote(stock);
  
    if (!stockResult) {
      return res.status(404).json({ error: 'Stock not found' });
    }
  
    return res.status(200).json(stockResult);
  }
  