import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Dashbar from '@/components/Dashboard/Dashbar'
import InvestmentTable  from '@/components/Dashboard/InvestmentTable'
import AuthLock from '@/components/AuthLock'
import { useStateContext } from '@/context/StateContext'
import { useRouter } from 'next/router'


function Dashboard() {

  const { user } = useStateContext()  

  const router = useRouter()
  
  const stocks = [
    {name: "Tesla", shares: 5, pricePerShare: 256.78},
    {name: "Microsoft", shares: 2, pricePerShare: 298.45},
    {name: "Amazon", shares: 10, pricePerShare: 172.65},
    {name: "Google", shares: 7, pricePerShare: 145.32}
  ];

  const cryptos = [
    {name: "Bitcoin", shares: 4, pricePerShare: 75000.32},
    {name: "Ethereum", shares: 10, pricePerShare: 1800.45},
    {name: "Binance Coin", shares: 15, pricePerShare: 320.12},
    {name: "Cardano", shares: 500, pricePerShare: 1.23},
    {name: "Solana", shares: 100, pricePerShare: 90.67}
  ];


  // useEffect(() => {
  //   if(!user){
  //     console.log("no auth for dashboard");
  //      router.push('/');
  //    }else{
  //    }
  //   }, user);


  return (
    <Dash>
      <AuthLock>
        <Dashbar/>
        <Body>
          <PositionData>
            <CurrentPosition>Current Position</CurrentPosition>
            <CurrentPosition>$15,253.70</CurrentPosition>
          </PositionData>
          <Investments>
            <InvestmentTable id="stocks" name="Stocks" investments={stocks}/>
            <InvestmentTable id="cryptos" name="Crypto" investments={cryptos}/>
          </Investments>
        </Body>
      </AuthLock>

    </Dash>
  );
};


//STYLED COMPONENTS
// const Section = styled.section`
// width: 100%;
// height: 100vh;
// display: flex;
// justify-content: center;
// `

// const TopHeader = styled.h1`
// font-size: 26px;
// display: flex;`

const Dash = styled.div`
color: white;
width: 100%;
height: 100%;
`;

const Body = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
// align-items: center;
margin-top: 40px;
`;

const PositionData = styled.div`
width: 40%;
background-color: black;
border: 1px solid grey;
padding: 15px;
`;

const Investments = styled.div`
width: 30%;
display: flex;
flex-direction: column;
// justify-content: center;
align-items: center;
`;

const CurrentPosition = styled.h1`
font-size: 30px;
font-weight: normal;`;


export default Dashboard