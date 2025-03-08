import styled from "styled-components"

const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

function StockHeader({stockData, formatCurrency, InfoLabel, InfoValue}) {

    return (
        <Header>
            {/* data from yahoo finance quote */}
            <StockInfoSection>
            <StockName>{stockData.shortName || stockData.longName}</StockName>
            <StockSymbol>{stockData.symbol}</StockSymbol>
            <StockPrice>
                {formatCurrency(stockData.regularMarketPrice)}
                <PriceChange isPositive={stockData.regularMarketChange >= 0}>
                {stockData.regularMarketChange > 0 ? "+" : ""}
                {formatCurrency(stockData.regularMarketChange)} 
                ({formatPercent(stockData.regularMarketChangePercent)})
                </PriceChange>
            </StockPrice>
            </StockInfoSection>
            
            <DataSection>
            <InfoGrid>
                <InfoItem>
                <InfoLabel>Market Cap</InfoLabel>
                <InfoValue>{stockData.marketCap ? formatCurrency(stockData.marketCap) : 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                <InfoLabel>Volume</InfoLabel>
                <InfoValue>{stockData.regularMarketVolume ? stockData.regularMarketVolume.toLocaleString() : 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                <InfoLabel>52-Week Range</InfoLabel>
                <InfoValue>
                    {stockData.fiftyTwoWeekLow && stockData.fiftyTwoWeekHigh ? 
                    `${formatCurrency(stockData.fiftyTwoWeekLow)} - ${formatCurrency(stockData.fiftyTwoWeekHigh)}` : 
                    'N/A'}
                </InfoValue>
                </InfoItem>
                <InfoItem>
                <InfoLabel>Open</InfoLabel>
                <InfoValue>{stockData.regularMarketOpen ? formatCurrency(stockData.regularMarketOpen) : 'N/A'}</InfoValue>
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

const StockInfoSection = styled.div`
  flex: 2;
`;

const StockName = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const StockSymbol = styled.h2`
  font-size: 16px;
  color: #999;
  margin: 0 0 16px 0;
`;

const StockPrice = styled.div`
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

export default StockHeader
