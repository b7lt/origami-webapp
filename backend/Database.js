import { doc, setDoc, getDoc, getDocs, collection, query, where, addDoc, serverTimestamp } from "firebase/firestore"
import { database } from "./Firebase"

// user
export async function createUserProfile(userId, email) {
  try {
    const userRef = doc(database, "users", userId);
    await setDoc(userRef, {
      // uid: userId,
      // email: email,
      displayName: email.split('@')[0],
      cashBalance: 10000, // Starting with $10,000
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error("Error createUserProfile:", error);
    throw error;
  }
}

export async function getUserProfile(userId) {
  try {
    const userRef = doc(database, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("getUserProfile: No user profile");
      return null;
    }
  } catch (error) {
    console.error("Error getUserProfile:", error);
    throw error;
  }
}

export async function updateUserLastLogin(userId) {
  try {
    const userRef = doc(database, "users", userId);
    await setDoc(userRef, {
      lastLoginAt: serverTimestamp()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error("Error updateUserLastLogin:", error);
    throw error;
  }
}

// stock
export async function getStockPositions(userId) {
  try {
    const positionsRef = collection(database, "users", userId, "positions");
    const posDoc = await getDocs(positionsRef);
    
    const positions = [];
    posDoc.forEach((doc) => {
      positions.push({
        symbol: doc.id,
        ...doc.data()
      });
    });
    
    return positions;
  } catch (error) {
    console.error("Error getStockPositions:", error);
    throw error;
  }
}

export async function updateStockPosition(userId, symbol, shares, costBasis, latestPrice = null) {
  try {
    const positionRef = doc(database, "users", userId, "positions", symbol);

    await setDoc(positionRef, {
      shares: shares,
      averageCostBasis: costBasis,
      latestPrice: latestPrice,
      lastUpdated: serverTimestamp()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error("Error updateStockPosition:", error);
    throw error;
  }
}

// crypto
export async function getCryptoPositions(userId) {
  try {
    const positionsRef = collection(database, "users", userId, "cryptoPositions");
    const posDoc = await getDocs(positionsRef);
    
    const positions = [];
    posDoc.forEach((doc) => {
      positions.push({
        coinId: doc.id,
        ...doc.data()
      });
    });

    return positions;
  } catch (error) {
    console.error("Error getCryptoPositions:", error);
    throw error;
  }
}

export async function updateCryptoPosition(userId, coinId, shares, costBasis, latestPrice = null) {
  try {
    const positionRef = doc(database, "users", userId, "cryptoPositions", coinId);

    await setDoc(positionRef, {
      shares: shares,
      averageCostBasis: costBasis,
      latestPrice: latestPrice,
      lastUpdated: serverTimestamp()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error("Error updateCryptoPosition:", error);
    throw error;
  }
}

// transactions
export async function recordTransaction(userId, type, assetType, symbol, shares, price, totalAmount, status = "completed") {
  try {
    const transactionRef = collection(database, "users", userId, "transactions");

    await addDoc(transactionRef, {
      type: type,
      assetType: assetType,
      symbol: symbol,
      shares: shares,
      price: price,
      totalAmount: totalAmount,
      timestamp: serverTimestamp(),
      status: status
    });

    return true;
  } catch (error) {
    console.error("Error recordTransaction:", error);
    throw error;
  }
}

export async function getTransactions(userId) {
  try {
    const transactionsRef = collection(database, "users", userId, "transactions");
    const q = query(transactionsRef);
    const transDoc = await getDocs(q);
    
    const transactions = [];
    transDoc.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

// record portfolio historical data for today
// if it already exists for today, it will update
export async function recordPortfolioSnapshot(userId, totalValue, cashBalance, stocksValue, cryptoValue) {
  try {
    const today = new Date();
    const dateId = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    const historyRef = doc(database, "users", userId, "portfolioHistory", dateId);
    await setDoc(historyRef, {
      date: serverTimestamp(),
      totalValue: totalValue,
      cashBalance: cashBalance,
      stocksValue: stocksValue,
      cryptoValue: cryptoValue
    });
    return true;
  } catch (error) {
    console.error("Error recording portfolio snapshot:", error);
    throw error;
  }
}

export async function getPortfolioHistory(userId, days = 30) {
  try {
    const historyRef = collection(database, "users", userId, "portfolioHistory");
    const docs = await getDocs(historyRef);
    
    const history = [];
    docs.forEach((doc) => {
      history.push({
        dateId: doc.id,
        ...doc.data()
      });
    });
    
    // Sort by date
    return history.sort((a, b) => {
      if (a.date && b.date) {
        return a.date.seconds - b.date.seconds;
      }
      return 0;
    });
  } catch (error) {
    console.error("Error fetching portfolio history:", error);
    throw error;
  }
}

// calculate value for today
export async function calculatePortfolioValue(userId) {
  try {
    // get user
    const userProfile = await getUserProfile(userId);
    if (!userProfile) return null;

    // stocks
    const stocks = await getStockPositions(userId);
    const stocksValue = stocks.reduce((total, position) => {
      const currentPrice = position.latestPrice || position.averageCostBasis;
      return total + (position.shares * currentPrice);
    }, 0);

    // cryptos
    const cryptos = await getCryptoPositions(userId);
    const cryptoValue = cryptos.reduce((total, position) => {
      const currentPrice = position.latestPrice || position.averageCostBasis;
      return total + (position.shares * currentPrice);
    }, 0);

    // calculate total
    const totalValue = userProfile.cashBalance + stocksValue + cryptoValue;

    // record snapshot
    await recordPortfolioSnapshot(
      userId,
      totalValue,
      userProfile.cashBalance,
      stocksValue,
      cryptoValue
    );

    // console.log({
    //   totalValue,
    //   cashBalance: userProfile.cashBalance,
    //   stocksValue,
    //   cryptoValue
    // });

    return {
      totalValue,
      cashBalance: userProfile.cashBalance,
      stocksValue,
      cryptoValue
    };
  } catch (error) {
    console.error("Error calculating portfolio value:", error);
    throw error;
  }
}