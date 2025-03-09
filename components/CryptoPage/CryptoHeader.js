import styled from "styled-components"

const formatPercent = (percent) => {
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
};

function CryptoHeader({cryptoData, formatCurrency, InfoLabel, InfoValue}) {
  return (
    <Header>
      <CryptoInfoSection>
        <CryptoImageAndName>
          {cryptoData.image && <CryptoImage src={cryptoData.image} alt={cryptoData.shortName} />}
          <div>
            <CryptoName>{cryptoData.shortName || cryptoData.longName}</CryptoName>
            <CryptoSymbol>{cryptoData.symbol}</CryptoSymbol>
          </div>
        </CryptoImageAndName>
        
        <CryptoPrice>
          {formatCurrency(cryptoData.regularMarketPrice)}
          <PriceChange isPositive={cryptoData.regularMarketChange >= 0}>
            {cryptoData.regularMarketChange > 0 ? "+" : ""}
            {formatCurrency(cryptoData.regularMarketChange)} 
            ({formatPercent(cryptoData.regularMarketChangePercent)})
          </PriceChange>
        </CryptoPrice>
      </CryptoInfoSection>
      
      <DataSection>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Market Cap</InfoLabel>
            <InfoValue>{cryptoData.marketCap ? formatCurrency(cryptoData.marketCap) : 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Volume (24h)</InfoLabel>
            <InfoValue>{cryptoData.regularMarketVolume ? formatCurrency(cryptoData.regularMarketVolume) : 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>24h Range</InfoLabel>
            <InfoValue>
              {cryptoData.fiftyTwoWeekLow && cryptoData.fiftyTwoWeekHigh ? 
                `${formatCurrency(cryptoData.fiftyTwoWeekLow)} - ${formatCurrency(cryptoData.fiftyTwoWeekHigh)}` : 
                'N/A'}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Market Rank</InfoLabel>
            <InfoValue>#{cryptoData.marketCapRank || 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Circulating Supply</InfoLabel>
            <InfoValue>{cryptoData.circulatingSupply ? 
              `${cryptoData.circulatingSupply.toLocaleString()} ${cryptoData.symbol}` : 
              'N/A'}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Total Supply</InfoLabel>
            <InfoValue>{cryptoData.totalSupply ? 
              `${cryptoData.totalSupply.toLocaleString()} ${cryptoData.symbol}` : 
              'N/A'}
            </InfoValue>
          </InfoItem>
        </InfoGrid>
      </DataSection>
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 24px;
  border-bottom: 1px solid #333;
  padding-bottom: 16px;
`;

const CryptoInfoSection = styled.div`
  flex: 2;
`;

const CryptoImageAndName = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const CryptoImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 50%;
`;

const CryptoName = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const CryptoSymbol = styled.h2`
  font-size: 16px;
  color: #999;
  margin: 0 0 16px 0;
`;

const CryptoPrice = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const PriceChange = styled.span`
  font-size: 16px;
  margin-left: 8px;
  color: ${props => props.isPositive ? 'var(--lime)' : 'var(--orange)'};
`;

const DataSection = styled.div`
  flex: 3;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const InfoItem = styled.div`
  margin-bottom: 8px;
`;

export default CryptoHeader;