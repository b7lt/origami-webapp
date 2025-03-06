import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
// import Link from 'next/link';

const AnimalPage = () => {
  const router = useRouter();
  const { stockTicker } = router.query;
  
  const [stockData, setStockData] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (stockTicker) {
      async function fetchData() {
        const data = await fetch(`/api/stock`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({stock: [stockTicker, "NVDA"]})
        });
        const json = await data.json();
        
        console.log(json);
        setStockData(json);
      }

      fetchData().catch(console.error);
    }
  }, [stockTicker]);

  return (
    <Section ref={sectionRef}>
      <TopHeader>Stock Info</TopHeader>
      {stockData ? (
        <Content>
        </Content>
      ) : (
        <p>Loading...</p>
      )}
      {/*<BackLink href="/">Back to Landing Page</BackLink>*/}
    </Section>
  );
};

// STYLED COMPONENTS
const Section = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const TopHeader = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-top: 10px;
  border-radius: 10px;
`;

/*const BackLink = styled(Link)`
  margin-top: 20px;
  font-size: 18px;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;*/

export default AnimalPage;
