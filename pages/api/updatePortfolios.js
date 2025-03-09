import { database } from '@/backend/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { calculatePortfolioValue } from '@/backend/Database';

export default async function handler(req, res) {
  // secret api requires secret token!
  const { authorization } = req.headers;
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authorization !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const usersRef = collection(database, "users");
    const userSnapshot = await getDocs(usersRef);
    
    if (userSnapshot.empty) {
      return res.status(200).json({ message: 'no users to update' });
    }

    const updateResults = [];
    const errors = [];

    for (const userDoc of userSnapshot.docs) {
      const userId = userDoc.id;
      
      try {
        const portfolioValue = await calculatePortfolioValue(userId);
        
        if (portfolioValue) {
          updateResults.push({
            userId,
            totalValue: portfolioValue.totalValue,
            success: true
          });
        } else {
          errors.push({
            userId,
            error: 'Failed to calculate portfolio value'
          });
        }
      } catch (error) {
        console.error(`Error updating portfolio for user ${userId}:`, error);
        errors.push({
          userId,
          error: error.message
        });
      }
    }

    return res.status(200).json({
      message: `Portfolio update completed for ${updateResults.length} users`,
      successCount: updateResults.length,
      errorCount: errors.length,
      timestamp: new Date().toISOString(),
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in portfolio update cron job:', error);
    return res.status(500).json({ 
      error: 'Failed to execute portfolio update',
      message: error.message
    });
  }
}