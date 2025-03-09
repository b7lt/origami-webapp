import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Dashbar from '@/components/Dashboard/Dashbar';
import { useStateContext } from '@/context/StateContext';
import { getUserProfile, getCryptoPositions } from '@/backend/Database';
import StockChart from '@/components/StockPage/StockChart';
import CryptoHeader from '@/components/CryptoPage/CryptoHeader';
import CryptoTrade from '@/components/CryptoPage/CryptoTrade';
import AuthLock from '@/components/AuthLock';

const CryptoPage = () => {
  const router = useRouter();
  const { coinId } = router.query;
  const { user } = useStateContext();
  
  // data from backend / APIs
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [userCash, setUserCash] = useState(0);

  // graph time range
  const [timeRange, setTimeRange] = useState('1mo');

  // fetch crypto data and user data
  useEffect(() => {
    if (coinId) {
      async function fetchData() {
        setLoading(true);
        try {
          // fetch crypto's current info (the quote)
          const response = await fetch(`/api/cryptoQuote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ coinId })
          });
          
          const data = await response.json();
          if (data.error) {
            console.error(data.error);
            return;
          }
          
          setCryptoData(data);

          // fetch crypto's historical data
          const historyResponse = await fetch(`/api/cryptoHistory`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              coinId,
              range: timeRange 
            })
          });
          
          const historyData = await historyResponse.json();

          if (historyData.error) {
            console.error(historyData.error);
          } else {
            setHistoricalData(historyData);
          }
          
          if (user) {
            const userProfileData = await getUserProfile(user.uid);
            setUserCash(userProfileData.cashBalance || 0);
            
            const userCryptoPositions = await getCryptoPositions(user.uid);
            const position = userCryptoPositions.find(pos => pos.coinId === coinId);

            if (position) {
              setUserPosition(position);
            }
          }
          
        } catch (error) {
          console.error("Error fetching crypto data:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }
  }, [coinId, timeRange, user]);

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
            <LoadingText>Loading cryptocurrency data...</LoadingText>
          </LoadingContainer>
        ) : cryptoData ? (
          <>
            <CryptoHeader cryptoData={cryptoData} formatCurrency={formatCurrency} InfoLabel={InfoLabel} InfoValue={InfoValue}/>
            
            <StockChart historicalData={historicalData} stockData={cryptoData} timeRange={timeRange} setTimeRange={setTimeRange} SectionTitle={SectionTitle}/>
            
            <CryptoTrade 
              SectionTitle={SectionTitle} InfoLabel={InfoLabel} InfoValue={InfoValue} 
              coinId={coinId} cryptoData={cryptoData} userPosition={userPosition} setUserPosition={setUserPosition} 
              userCash={userCash} setUserCash={setUserCash} user={user}
            />
          </>
        ) : (
          <ErrorMessage>Cryptocurrency not found or error loading data</ErrorMessage>
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

export default CryptoPage;