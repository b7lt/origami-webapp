import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getPortfolioHistory } from '@/backend/Database';
import { useStateContext } from '@/context/StateContext';

const PortfolioHistoryChart = () => {
  const { user } = useStateContext();
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [percentChange, setPercentChange] = useState(0);
  const [valueChange, setValueChange] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    async function fetchPortfolioHistory() {
      if (!user) return;
      
      try {
        setLoading(true);
        const history = await getPortfolioHistory(user.uid, timeRange);
        
        if (history && history.length > 0) {
          // sort by ascending dates
          const sortedHistory = [...history].sort((a, b) => {
            if (a.date && b.date) {
              return a.date.seconds - b.date.seconds;
            }
            return 0;
          });
          
          // format data
          const formattedData = sortedHistory.map(item => ({
            date: item.date ? new Date(item.date.seconds * 1000) : new Date(),
            totalValue: item.totalValue || 0,
            cashBalance: item.cashBalance || 0,
            stocksValue: item.stocksValue || 0,
            cryptoValue: item.cryptoValue || 0,
            // fix date
            formattedDate: item.date ? new Date(item.date.seconds * 1000).toLocaleDateString() : '',
          }));

          console.log(formattedData)
          
          setPortfolioData(formattedData);
          
          // calculations
          if (formattedData.length > 1) {
            const firstValue = formattedData[0].totalValue;
            const lastValue = formattedData[formattedData.length - 1].totalValue;
            setCurrentValue(lastValue);
            
            const change = lastValue - firstValue;
            setValueChange(change);
            
            const percentChangeValue = firstValue > 0 
              ? ((lastValue - firstValue) / firstValue) * 100 
              : 0;
            setPercentChange(percentChangeValue);
          } else if (formattedData.length === 1) {
            setCurrentValue(formattedData[0].totalValue);
            setPercentChange(0);
            setValueChange(0);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching portfolio history:", error);
        setLoading(false);
      }
    }
    
    fetchPortfolioHistory();
  }, [user, timeRange]);

  // if just one data point (one date), dupe point so we can have a line instead of just a point
  const chartData = portfolioData.length === 1 
    ? [
        { ...portfolioData[0], date: new Date(portfolioData[0].date.getTime() - 86400000) }, // 1 day before
        { ...portfolioData[0] }
      ] 
    : portfolioData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  

  const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const formatYAxisTick = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  // this SUCKED to setup
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <TooltipContainer>
          <TooltipDate>{payload[0].payload.formattedDate}</TooltipDate>
          <TooltipValue>{formatCurrency(payload[0].value)}</TooltipValue>
          <TooltipDetailsGrid>
            <TooltipDetailItem>
              <TooltipDetailLabel>Cash</TooltipDetailLabel>
              <TooltipDetailValue>{formatCurrency(payload[0].payload.cashBalance)}</TooltipDetailValue>
            </TooltipDetailItem>
            <TooltipDetailItem>
              <TooltipDetailLabel>Stocks</TooltipDetailLabel>
              <TooltipDetailValue>{formatCurrency(payload[0].payload.stocksValue)}</TooltipDetailValue>
            </TooltipDetailItem>
            <TooltipDetailItem>
              <TooltipDetailLabel>Crypto</TooltipDetailLabel>
              <TooltipDetailValue>{formatCurrency(payload[0].payload.cryptoValue)}</TooltipDetailValue>
            </TooltipDetailItem>
          </TooltipDetailsGrid>
        </TooltipContainer>
      );
    }
    return null;
  };

  // if we've gained, green line!
  const lineColor = percentChange >= 0 ? 'var(--lime)' : 'var(--orange)';

  return (
    <ChartContainer>
      {loading ? (
        <LoadingContainer>
          <LoadingText>Loading portfolio data...</LoadingText>
        </LoadingContainer>
      ) : portfolioData.length === 0 ? (
        <LoadingContainer>
          <LoadingText>No portfolio history available</LoadingText>
        </LoadingContainer>
      ) : (
        <ChartContent>
          <HeaderSection>
            <CurrentValueText>{formatCurrency(currentValue)}</CurrentValueText>
            <ChangeInfoContainer>
              <ChangeValueText isPositive={percentChange >= 0}>
                {formatCurrency(valueChange)} ({formatPercent(percentChange)})
              </ChangeValueText>
              {timeRange ? (
                <TimePeriodText>Past {timeRange} Days</TimePeriodText>
              ) : (
                <TimePeriodText>All Time</TimePeriodText>
              )}
            </ChangeInfoContainer>
          </HeaderSection>
          
          <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  stroke="#666"
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: '#444' }}
                  tickLine={{ stroke: '#444' }}
                  minTickGap={30}
                />
                <YAxis
                  domain={['dataMin - 500', 'dataMax + 500']}
                  tickFormatter={formatYAxisTick}
                  stroke="#666"
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: '#444' }}
                  tickLine={{ stroke: '#444' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="totalValue" 
                  stroke={lineColor} 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6, fill: lineColor }} 
                />
                {portfolioData.length > 0 && (
                  <ReferenceLine 
                    y={portfolioData[0].totalValue} 
                    stroke="#666" 
                    strokeDasharray="3 3" 
                    strokeWidth={1} 
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <TimeRangeButtonsContainer>
            {/* <TimeRangeButton className={timeRange == 1 ? 'selected' : 'not'} onClick={() => setTimeRange(1)}>1D</TimeRangeButton> */}
            <TimeRangeButton className={timeRange == 7 ? 'selected' : 'not'} onClick={() => setTimeRange(7)}>1W</TimeRangeButton>
            <TimeRangeButton className={timeRange == 30 ? 'selected' : 'not'} onClick={() => setTimeRange(30)}>1M</TimeRangeButton>
            <TimeRangeButton className={timeRange == 90 ? 'selected' : 'not'} onClick={() => setTimeRange(90)}>3M</TimeRangeButton>
            <TimeRangeButton className={timeRange == 365 ? 'selected' : 'not'} onClick={() => setTimeRange(365)}>1Y</TimeRangeButton>
            <TimeRangeButton className={timeRange == null ? 'selected' : 'not'} onClick={() => setTimeRange(null)}>All</TimeRangeButton>
          </TimeRangeButtonsContainer>
        </ChartContent>
      )}
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  // border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 256px;
`;

const LoadingText = styled.p`
  color: #999;
`;

const ChartContent = styled.div`
  height: 100%;
`;

const HeaderSection = styled.div`
  margin-bottom: 16px;
`;

const CurrentValueText = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0;
`;

const ChangeInfoContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 4px;
`;

const ChangeValueText = styled.span`
  font-size: 14px;
  color: ${props => props.isPositive ? 'var(--lime)' : 'var(--orange)'};
`;

const TimePeriodText = styled.span`
  font-size: 14px;
  color: #999;
`;

const ChartWrapper = styled.div`
  height: 256px;
`;

const TimeRangeButtonsContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const TimeRangeButton = styled.button`
  padding: 4px 12px;
  border-radius: 20px;
  background-color: #333;
  color: white;
  font-size: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--grey-hover);
  }

  &.selected {
    background-color: white;
    color: black;
  }
`;

// Tooltip Styled Components
const TooltipContainer = styled.div`
  background-color: var(--background);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #444;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const TooltipDate = styled.p`
  color: #999;
  font-size: 12px;
  margin: 0 0 4px 0;
`;

const TooltipValue = styled.p`
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
`;

const TooltipDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const TooltipDetailItem = styled.div`
  margin-top: 4px;
`;

const TooltipDetailLabel = styled.p`
  color: #999;
  font-size: 12px;
  margin: 0;
`;

const TooltipDetailValue = styled.p`
  color: white;
  font-size: 12px;
  margin: 0;
`;

export default PortfolioHistoryChart;