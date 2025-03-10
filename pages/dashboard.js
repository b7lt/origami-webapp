import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Dashbar from '@/components/Dashboard/Dashbar'
import InvestmentTable  from '@/components/Dashboard/InvestmentTable'
import AuthLock from '@/components/AuthLock'
import { useStateContext } from '@/context/StateContext'
import { useRouter } from 'next/router'
import { getStockPositions, getCryptoPositions, calculatePortfolioValue } from '@/backend/Database'
import Chart from '@/components/Dashboard/PortfolioHistoryChart'

function Dashboard() {

  const { user } = useStateContext()  

  const router = useRouter()
  
  // const stocks = [
  //   {name: "Tesla", shares: 5, pricePerShare: 256.78},
  //   {name: "Microsoft", shares: 2, pricePerShare: 298.45},
  //   {name: "Amazon", shares: 10, pricePerShare: 172.65},
  //   {name: "Google", shares: 7, pricePerShare: 145.32}
  // ];

  // const cryptos = [
  //   {name: "Bitcoin", shares: 4, pricePerShare: 75000.32},
  //   {name: "Ethereum", shares: 10, pricePerShare: 1800.45},
  //   {name: "Binance Coin", shares: 15, pricePerShare: 320.12},
  //   {name: "Cardano", shares: 500, pricePerShare: 1.23},
  //   {name: "Solana", shares: 100, pricePerShare: 90.67}
  // ];


  // useEffect(() => {
  //   if(!user){
  //     console.log("no auth for dashboard");
  //      router.push('/');
  //    }else{
  //    }
  //   }, user);

  const [stocks, setStocks] = useState([]);
  const [cryptos, setCryptos] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState({
    totalValue: 0,
    cashBalance: 0,
    stocksValue: 0,
    cryptoValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        //  stocks
        const stockPositions = await getStockPositions(user.uid);
        const formattedStocks = stockPositions.map(position => ({
          name: position.name,
          ticker: position.symbol,
          shares: position.shares,
          latestPrice: position.latestPrice
        }));
        setStocks(formattedStocks);
        
        // crypto
        const cryptoPositions = await getCryptoPositions(user.uid);
        const formattedCryptos = cryptoPositions.map(position => ({
          name: position.name,
          ticker: position.coinId,
          shares: position.shares,
          latestPrice: position.latestPrice
        }));
        setCryptos(formattedCryptos);
        
        // total portfolio
        const portfolio = await calculatePortfolioValue(user.uid, stockPositions, cryptoPositions);
        if (portfolio) {
          setPortfolioValue(portfolio);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [user]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };



  return (
    <Dash>
      <AuthLock>
        <Dashbar/>
        <Body>
          <PositionData>
            {/* <CurrentPosition>Current Position</CurrentPosition>
            <CurrentPosition>{loading ? 'Loading...' : formatCurrency(portfolioValue.totalValue)}</CurrentPosition> */}
            <Chart/>
          </PositionData>
          <Investments>
            <InvestmentTable id="stocks" name="Stocks" investments={stocks}/>
            <InvestmentTable id="cryptos" name="Crypto" investments={cryptos}/>
          </Investments>
        </Body>
      </AuthLock>

    </Dash>
  );
};


//STYLED COMPONENTS
// const Section = styled.section`
// width: 100%;
// height: 100vh;
// display: flex;
// justify-content: center;
// `

// const TopHeader = styled.h1`
// font-size: 26px;
// display: flex;`

const Dash = styled.div`
color: white;
width: 100%;
height: 100%;
`;

const Body = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
// align-items: center;
margin-top: 40px;
`;

const PositionData = styled.div`
width: 43%;
background-color: black;
border: 1px solid #333;
border-radius: 8px;
padding: 15px;
`;

const Investments = styled.div`
width: 30%;
display: flex;
flex-direction: column;
// justify-content: center;
align-items: center;
`;


export default Dashboard