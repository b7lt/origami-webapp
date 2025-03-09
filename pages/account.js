import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dashbar from '@/components/Dashboard/Dashbar';
import { useStateContext } from '@/context/StateContext';
import { getUserProfile, updateUserCashBalance, getStockPositions, getCryptoPositions, updateStockPosition, updateCryptoPosition } from '@/backend/Database';
import AuthLock from '@/components/AuthLock';

const Account = () => {
  const { user } = useStateContext();
  const [cashBalance, setCashBalance] = useState(0);
  const [newCashBalance, setNewCashBalance] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;
      
      try {
        setLoading(true);
        const userProfileData = await getUserProfile(user.uid);
        setCashBalance(userProfileData.cashBalance || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ text: 'Error loading account information', type: 'error' });
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [user]);

  const handleUpdateCashBalance = async () => {
    if (!newCashBalance || isNaN(parseFloat(newCashBalance))) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const newBalance = parseFloat(newCashBalance);
      await updateUserCashBalance(user.uid, newBalance);
      setCashBalance(newBalance);
      setNewCashBalance('');
      setMessage({ text: 'Cash balance updated successfully', type: 'success' });
      setLoading(false);
    } catch (error) {
      console.error("Error updating cash balance:", error);
      setMessage({ text: 'Error updating cash balance', type: 'error' });
      setLoading(false);
    }
  };

  const handleResetPortfolio = async () => {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      return;
    }

    try {
      setLoading(true);

      await updateUserCashBalance(user.uid, 100000);
      setCashBalance(100000);
      
      const stockPositions = await getStockPositions(user.uid);
      
      for (const position of stockPositions) {
        await updateStockPosition(
          user.uid,
          position.symbol,
          0, // zero shares
          position.averageCostBasis
        );
      }
      
      const cryptoPositions = await getCryptoPositions(user.uid);
      
      for (const position of cryptoPositions) {
        await updateCryptoPosition(
          user.uid,
          position.coinId,
          0, // zero coins
          position.averageCostBasis
        );
      }
      
      setMessage({ text: 'Portfolio reset successfully. Cash balance is now $100,000.', type: 'success' });
      setIsConfirmingReset(false);
      setLoading(false);
    } catch (error) {
      console.error("Error resetting portfolio:", error);
      setMessage({ text: 'Error resetting portfolio', type: 'error' });
      setIsConfirmingReset(false);
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <BodyDiv>
      <AuthLock>
        <Dashbar />
        <Content>
          <AccountHeader>Account Settings</AccountHeader>
          
          {loading ? (
            <LoadingContainer>
              <LoadingText>Loading account information...</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              <Section>
                <SectionTitle>Cash Balance</SectionTitle>
                <InfoItem>
                  <InfoLabel>Current Balance</InfoLabel>
                  <InfoValue>{formatCurrency(cashBalance)}</InfoValue>
                </InfoItem>
                
                <UpdateBalanceForm>
                  <FormGroup>
                    <Label>New Cash Balance</Label>
                    <InputGroup>
                      <Input 
                        type="number" 
                        value={newCashBalance} 
                        onChange={(e) => setNewCashBalance(e.target.value)}
                        placeholder="Enter new balance"
                        min="0"
                        step="0.01"
                      />
                      <ActionButton onClick={handleUpdateCashBalance} disabled={loading}>
                        Update Balance
                      </ActionButton>
                    </InputGroup>
                  </FormGroup>
                </UpdateBalanceForm>
              </Section>
              
              <Section>
                <SectionTitle>Reset Portfolio</SectionTitle>
                <WarningText>
                  This will reset your entire portfolio. All your stocks and cryptocurrencies will be sold, 
                  and your cash balance will be set to $100,000.
                </WarningText>
                
                <ResetButtonContainer>
                  {!isConfirmingReset ? (
                    <DangerButton onClick={handleResetPortfolio} disabled={loading}>
                      Reset Portfolio
                    </DangerButton>
                  ) : (
                    <>
                      <ConfirmText>Are you sure? This cannot be undone.</ConfirmText>
                      <ButtonGroup>
                        <DangerConfirmButton onClick={handleResetPortfolio} disabled={loading}>
                          Yes, Reset Everything
                        </DangerConfirmButton>
                        <CancelButton onClick={() => setIsConfirmingReset(false)} disabled={loading}>
                          Cancel
                        </CancelButton>
                      </ButtonGroup>
                    </>
                  )}
                </ResetButtonContainer>
              </Section>
            </>
          )}
          
          {message.text && (
            <MessageContainer type={message.type}>
              {message.text}
            </MessageContainer>
          )}
        </Content>
      </AuthLock>
    </BodyDiv>
  );
};

const BodyDiv = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const AccountHeader = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  border-bottom: 1px solid #333;
  padding-bottom: 12px;
`;

const Section = styled.section`
  margin-bottom: 32px;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 0 0 16px 0;
`;

const InfoItem = styled.div`
  margin-bottom: 16px;
  padding: 8px;
  background-color: #111;
  border-radius: 4px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const UpdateBalanceForm = styled.div`
  margin-top: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  background-color: #111;
  border: 1px solid #333;
  border-radius: 4px;
  color: white;
  font-size: 16px;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
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
  
  &:hover:not(:disabled) {
    background-color:rgb(143, 254, 153);
  }
`;

const WarningText = styled.p`
  color:rgb(255, 165, 70);
  margin-bottom: 16px;
  line-height: 1.5;
`;

const ResetButtonContainer = styled.div`
  margin-top: 16px;
`;

const DangerButton = styled.button`
  padding: 10px 16px;
  background-color: var(--orange);
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #ff6a1f;
  }
`;

const ConfirmText = styled.p`
  color: var(--orange);
  margin-bottom: 12px;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const DangerConfirmButton = styled(DangerButton)`
  background-color:rgb(255, 64, 6);
  
  &:hover:not(:disabled) {
    background-color:rgb(255, 34, 1);
  }
`;

const CancelButton = styled.button`
  padding: 10px 16px;
  background-color: #333;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: #444;
  }
`;

const MessageContainer = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  text-align: center;
  background-color: ${props => props.type === 'error' ? '#ff3b3b15' : '#77ec7e15'};
  color: ${props => props.type === 'error' ? '#ff5050' : 'var(--lime)'};
  border: 1px solid ${props => props.type === 'error' ? '#ff5050' : 'var(--lime)'};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: #999;
`;

export default Account;