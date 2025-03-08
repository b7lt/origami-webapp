import styled from "styled-components";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// chart hover tooltip
const CustomTooltip = ({ active, payload, label }) => {
if (active && payload && payload.length) {
    return (
    <TooltipContainer>
        <TooltipDate>{label}</TooltipDate>
        <TooltipValue>{formatCurrency(payload[0].value)}</TooltipValue>
    </TooltipContainer>
    );
}
return null;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };


function StockChart({ historicalData, stockData, timeRange, setTimeRange, SectionTitle }) {

    return(
        <ChartSection>
            <ChartHeader>
            <SectionTitle>Price History</SectionTitle>
            <TimeRangeButtonsContainer>
                <TimeRangeButton className={timeRange === '1d' ? 'selected' : ''} onClick={() => setTimeRange('1d')}>1D</TimeRangeButton>
                <TimeRangeButton className={timeRange === '5d' ? 'selected' : ''} onClick={() => setTimeRange('5d')}>5D</TimeRangeButton>
                <TimeRangeButton className={timeRange === '1mo' ? 'selected' : ''} onClick={() => setTimeRange('1mo')}>1M</TimeRangeButton>
                <TimeRangeButton className={timeRange === '3mo' ? 'selected' : ''} onClick={() => setTimeRange('3mo')}>3M</TimeRangeButton>
                <TimeRangeButton className={timeRange === '1y' ? 'selected' : ''} onClick={() => setTimeRange('1y')}>1Y</TimeRangeButton>
                <TimeRangeButton className={timeRange === '5y' ? 'selected' : ''} onClick={() => setTimeRange('5y')}>5Y</TimeRangeButton>
            </TimeRangeButtonsContainer>
            </ChartHeader>
            
            {historicalData.length > 0 ? (
            <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis 
                    dataKey="date" 
                    stroke="#666"
                    tick={{ fontSize: 10 }}
                    axisLine={{ stroke: '#444' }}
                    tickLine={{ stroke: '#444' }}
                    />
                    <YAxis 
                    domain={['auto', 'auto']}
                    stroke="#666"
                    tick={{ fontSize: 10 }}
                    axisLine={{ stroke: '#444' }}
                    tickLine={{ stroke: '#444' }}
                    tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={stockData.regularMarketChange >= 0 ? 'var(--lime)' : 'var(--orange)'} 
                    strokeWidth={2} 
                    dot={false} 
                    />
                </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
            ) : (
            <NoDataMessage>No historical data available</NoDataMessage>
            )}
        </ChartSection>
    );
}

const ChartSection = styled.section`
  margin-bottom: 24px;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const TimeRangeButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const TimeRangeButton = styled.button`
  padding: 4px 12px;
  background-color: #333;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  
  &.selected {
    background-color: white;
    color: black;
  }
  
  &:hover {
    background-color: #444;
  }
`;

const ChartContainer = styled.div`
  height: 300px;
`;

const NoDataMessage = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
`;


const TooltipContainer = styled.div`
  background-color: black;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const TooltipDate = styled.div`
  font-size: 12px;
  color: #999;
`;

const TooltipValue = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: white;
`;

export default StockChart;