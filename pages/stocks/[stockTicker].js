import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Dashbar from '@/components/Dashboard/Dashbar';
// import Link from 'next/link';

const StockPage = () => {
  const router = useRouter();
  const { stockTicker } = router.query;
  
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    if (stockTicker) {
      async function fetchData() {
        const data = await fetch(`/api/stockQuote`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({stock: stockTicker})
        });
        const json = await data.json();
        
        console.log(json);
        setStockData(json);
      }

      fetchData().catch(console.error);
    }
  }, [stockTicker]);

  return (
    <Section>
      <Dashbar/>
      <TopHeader>Stock Info</TopHeader>
      {stockData ? (
        <Content>
        </Content>
      ) : (
        <p>Loading...</p>
      )}
    </Section>
  );
};

// STYLED COMPONENTS
const Section = styled.div`
  width: 100%;
  height: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // padding: 20px;
`;

const TopHeader = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
`;


export default StockPage;
