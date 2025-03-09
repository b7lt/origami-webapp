import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { updateCryptoPosition, recordTransaction, updateUserCashBalance } from "@/backend/Database";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

function CryptoTrade({SectionTitle, InfoLabel, InfoValue, coinId, cryptoData, userPosition, setUserPosition, userCash, setUserCash, user}) {
  const [tradeType, setTradeType] = useState('buy');
  const [coins, setCoins] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [processingTrade, setProcessingTrade] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');

  useEffect(() => {
    if (cryptoData && coins) {
      // since coins might be a string, to be safe..
      const coinCount = parseFloat(coins);
      const price = cryptoData.regularMarketPrice;
      if (!isNaN(coinCount) && coinCount > 0) {
        setEstimatedCost(coinCount * price);
      } else {
        setEstimatedCost(0);
      }
    }
  }, [coins, cryptoData]);

  const handleTrade = async () => {
    // catch any errors
    if (!user || !cryptoData || !coins || isNaN(parseFloat(coins)) || parseFloat(coins) <= 0) {
      setTradeMessage('Please enter a valid number of coins.');
      return;
    }

    // we need to set a processing trade/loading var so that the user doesnt initiate double/triple trades etc
    setProcessingTrade(true);
    setTradeMessage('');
    
    try {
      const coinCount = parseFloat(coins);
      const currentPrice = cryptoData.regularMarketPrice;
      const totalAmount = coinCount * currentPrice;
      
      if (tradeType === 'buy') {
        if (totalAmount > userCash) {
          setTradeMessage('Insufficient funds for this purchase.');
          setProcessingTrade(false);
          return;
        }
        
        let newCoins = coinCount;
        let newCostBasis = currentPrice;
        
        // if the user alr has coins, we can calculate a new cost basis via average
        if (userPosition) {
          newCoins = userPosition.shares + coinCount;
          newCostBasis = ((userPosition.shares * userPosition.averageCostBasis) + totalAmount) / newCoins;
        }
        
        // update in firestore
        await updateCryptoPosition(
          user.uid,
          coinId,
          newCoins,
          newCostBasis,
          currentPrice,
          cryptoData.shortName || cryptoData.longName
        );

        await recordTransaction(
          user.uid,
          'buy',
          'crypto',
          cryptoData.symbol,
          coinCount,
          currentPrice,
          totalAmount
        );
        
        await updateUserCashBalance(user.uid, userCash - totalAmount);
        
        setTradeMessage(`Successfully purchased ${coinCount} ${cryptoData.symbol} for ${formatCurrency(totalAmount)}`);
        
        // update states
        setUserCash(userCash - totalAmount);
        setUserPosition({
          ...userPosition,
          shares: newCoins,
          averageCostBasis: newCostBasis,
          latestPrice: currentPrice
        });
        
      } else if (tradeType === 'sell') {
        // can't sell what ya don't got
        if (!userPosition || userPosition.shares < coinCount) {
          setTradeMessage('You do not have enough coins to sell.');
          setProcessingTrade(false);
          return;
        }
        
        const newCoins = userPosition.shares - coinCount;
        
        // update in Firestore
        await updateCryptoPosition(
          user.uid,
          coinId,
          newCoins,
          userPosition.averageCostBasis,
          currentPrice
        );
        
        await recordTransaction(
          user.uid,
          'sell',
          'crypto',
          cryptoData.symbol,
          coinCount,
          currentPrice,
          totalAmount
        );
        
        await updateUserCashBalance(user.uid, userCash + totalAmount);
        
        setTradeMessage(`Successfully sold ${coinCount} ${cryptoData.symbol} for ${formatCurrency(totalAmount)}`);
        
        // update states
        setUserCash(userCash + totalAmount);
        if (newCoins === 0) {
          setUserPosition(null);
        } else {
          setUserPosition({
            ...userPosition,
            shares: newCoins,
            latestPrice: currentPrice
          });
        }
      }
      
      setCoins('');
      
    } catch (error) {
      console.error('Error processing trade:', error);
      setTradeMessage('An error occurred while processing your trade. Please try again.');
    } finally {
      setProcessingTrade(false);
    }
  };

  return (
    <TradingSection>
      <SectionTitle>Trade {cryptoData.symbol}</SectionTitle>
      
      <TradeForm>
        <TradeTypeContainer>
          <TradeTypeButton 
            className={tradeType === 'buy' ? 'selected' : ''} onClick={() => setTradeType('buy')} id={"buy"}
          >
            Buy
          </TradeTypeButton>
          <TradeTypeButton 
            className={tradeType === 'sell' ? 'selected' : ''} onClick={() => setTradeType('sell')} disabled={!userPosition || userPosition.shares <= 0} id={"sell"}
          >
            Sell
          </TradeTypeButton>
        </TradeTypeContainer>
        
        <PositionInfo>
          <InfoLabel>Available Cash</InfoLabel>
          <InfoValue>{formatCurrency(userCash)}</InfoValue>
          
          {userPosition && (
            <>
              <InfoLabel>Current Position</InfoLabel>
              <InfoValue>{userPosition.shares} coins @ {formatCurrency(userPosition.averageCostBasis)}</InfoValue>
            </>
          )}
        </PositionInfo>
        
        <FormGroup>
          <Label>Coins</Label>
          <Input 
            type="number" 
            value={coins} 
            onChange={(e) => setCoins(e.target.value)}
            min="0"
            step="0.0001"
            placeholder="0"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Estimated {tradeType === 'buy' ? 'Cost' : 'Proceeds'}</Label>
          <EstimatedCost>{formatCurrency(estimatedCost)}</EstimatedCost>
        </FormGroup>
        
        <ActionButton 
          onClick={handleTrade}
          disabled={
            processingTrade || !coins || isNaN(parseFloat(coins)) || parseFloat(coins) <= 0 ||
            (tradeType === 'buy' && estimatedCost > userCash) ||
            (tradeType === 'sell' && (!userPosition || userPosition.shares < parseFloat(coins)))
          }
        >
          {processingTrade ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${cryptoData.symbol}`}
        </ActionButton>
        
        {tradeMessage && <TradeMessage>{tradeMessage}</TradeMessage>}
      </TradeForm>
    </TradingSection>
  )
}

const TradingSection = styled.section`
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
`;

const TradeForm = styled.div`
  margin-top: 16px;
  max-width: 400px;
`;

const TradeTypeContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const TradeTypeButton = styled.button`
  flex: 1;
  padding: 8px;
  background-color: #333;
  border: none;
  color: white;
  cursor: pointer;
  
  &#buy {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  &#sell {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  &.selected {
    background-color: white;
    color: black;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PositionInfo = styled.div`
  margin-bottom: 16px;
  padding: 8px;
  background-color: #111;
  border-radius: 4px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  background-color: #111;
  border: 1px solid #333;
  border-radius: 4px;
  color: white;
`;

const EstimatedCost = styled.div`
  padding: 8px;
  background-color: #111;
  border: 1px solid #333;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: var(--lime);
  border: none;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TradeMessage = styled.div`
  margin-top: 16px;
  padding: 8px;
  border-radius: 4px;
  background-color: #222;
  font-size: 14px;
`;

export default CryptoTrade;