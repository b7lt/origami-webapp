import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Dashbar from '@/components/Dashboard/Dashbar';
import { useStateContext } from '@/context/StateContext';
import { getUserProfile, getStockPositions } from '@/backend/Database';
import StockHeader from '@/components/StockPage/StockHeader';
import StockChart from '@/components/StockPage/StockChart';
import StockTrade from '@/components/StockPage/StockTrade';
import AuthLock from '@/components/AuthLock';

const StockPage = () => {
  const router = useRouter();
  const { stockTicker } = router.query;
  const { user } = useStateContext();
  
  // data from backend / APIs
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [userCash, setUserCash] = useState(0);

  // graph time range
  const [timeRange, setTimeRange] = useState('1mo');

  // Fetch stock quote data
  useEffect(() => {
    if (stockTicker) {
      async function fetchData() {
        setLoading(true);
        try {
          // fetch stock's current info (the quote)
          const response = await fetch(`/api/stockQuote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stock: stockTicker })
          });
          
          const data = await response.json();
          if (data.error) {
            console.error(data.error);
            return;
          }
          
          setStockData(data);
          

          // fetch stock's historical data
          const historyResponse = await fetch(`/api/stockHistory`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              stock: stockTicker,
              range: timeRange 
            })
          });
          
          const historyData = await historyResponse.json();
          // console.log(historyData);

          if (historyData.error) {
            console.error(historyData.error);
          } else {
            setHistoricalData(historyData.map(point => {
              return {
                date: point.date,
                price: point.close
              };
            }));
          }
          
          if (user) {
            const userProfileData = await getUserProfile(user.uid);
            setUserCash(userProfileData.cashBalance || 0);
            
            const userStockPositions = await getStockPositions(user.uid);
            const position = userStockPositions.find(pos => pos.symbol === stockTicker);

            if (position) {
              setUserPosition(position);
            }
          }
          
        } catch (error) {
          console.error("Error fetching stock data:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }
  }, [stockTicker, timeRange, user]);


  // i feel like ive repeated this function way too many times..
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };


  return (
    <PageContainer>
      <AuthLock>
      <Dashbar />
      <Content>
        {loading ? (
          <LoadingContainer>
            <LoadingText>Loading stock data...</LoadingText>
          </LoadingContainer>
        ) : stockData ? (
          <>
            <StockHeader stockData={stockData} formatCurrency={formatCurrency} InfoLabel={InfoLabel} InfoValue={InfoValue}/>
            
            <StockChart historicalData={historicalData} stockData={stockData} timeRange={timeRange} setTimeRange={setTimeRange} SectionTitle={SectionTitle}/>
            
            <StockTrade SectionTitle={SectionTitle} InfoLabel={InfoLabel} InfoValue={InfoValue} stockTicker={stockTicker}
            stockData={stockData} userPosition={userPosition} setUserPosition={setUserPosition} userCash={userCash} setUserCash={setUserCash} user={user}/>
          </>
        ) : (
          <ErrorMessage>Stock not found or error loading data</ErrorMessage>
        )}
      </Content>
      </AuthLock>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: #999;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
`;

const InfoValue = styled.div`
  font-size: 14px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin: 0;
`;

const ErrorMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: var(--orange);
  font-size: 18px;
`;

export default StockPage;