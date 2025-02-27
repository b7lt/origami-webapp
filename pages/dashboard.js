import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Dashbar from '@/components/Dashboard/Dashbar'
import { useStateContext } from '@/context/StateContext'
import { useRouter } from 'next/router'


const Dashboard = () => {

  const { user } = useStateContext()  

  const router = useRouter()


  // useEffect(() => {
  //   if(!user){
  //     router.push('/')
  //   }else{
  //   }
  // }, user)




  return (
    <Dash>
      <Dashbar/>
      <Body>
        <PositionData>
          <CurrentPosition>Current Position</CurrentPosition>
          <CurrentPosition>$15,253.70</CurrentPosition>
        </PositionData>
        <Investments>
          <InvestmentTable id="stocks">
            <TableHead>
              <TableRow>
                <TableHeader>Stocks</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className="stock">
                <TableItem>Nvidia</TableItem>
                <TablePrice>$5000</TablePrice>
              </TableRow>
              <TableRow className="stock">
                <TableItem>Apple</TableItem>
                <TablePrice>$430</TablePrice>
              </TableRow>
            </TableBody>
          </InvestmentTable>
        
          <InvestmentTable id="cryptos">
            <TableHead>
              <TableRow>
                <TableHeader>Crypto</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className="crypto">
                <TableItem>Bitcoin</TableItem>
                <TablePrice>$5</TablePrice>
              </TableRow>
              <TableRow className="crypto">
                <TableItem>Ethereum</TableItem>
                <TablePrice>$6</TablePrice>
              </TableRow>
            </TableBody>
          </InvestmentTable>
        </Investments>
      </Body>
    </Dash>
  )
}


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

const InvestmentTable = styled.table`
width: 50%;
border: 1px solid grey;
border-collapse: collapse;
background-color: black;

&#stocks {
  border-bottom: 0;
}
&#cryptos {
  border-top: 0;
}
`;

const TableHead = styled.thead`
font-weight: bold;
// background-color: grey;
`;

const TableHeader = styled.th`
font-weight: 700;
padding-top: 6px;
padding-bottom: 6px;
// margin-top: 20px;
`;

const TableBody = styled.tbody`
`;
// 
const TableRow = styled.tr`
// border: 1px solid grey;
// display: block;
padding-top: 10px;

&.stock:hover, &.crypto:hover {
  background-color: var(--grey-hover)
}
`;

const TableItem = styled.td`
padding: 6px 10px 6px 10px;
float: left;
`;

const TablePrice = styled.td`
padding: 8px 10px 8px 5px;
float: right; 
`;


export default Dashboard