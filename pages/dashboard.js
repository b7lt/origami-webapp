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
          <InvestmentTable>
            <TableHead>
              <TableRow>
                <TableItem>Stocks</TableItem>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableItem>Nvidia</TableItem>
                <TablePrice>$5000</TablePrice>
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
align-items: center;
`;

const PositionData = styled.div`
width: 40%;
`;

const Investments = styled.div`
width: 30%;
display: flex;
justify-content: center;
`;

const CurrentPosition = styled.h1`
font-size: 30px;
font-weight: normal;
`;

const InvestmentTable = styled.table`
width: 40%;
border: 1px solid grey;
`;

const TableHead = styled.thead`
font-weight: bold;

`;

const TableBody = styled.tbody`
`;

const TableRow = styled.tr`
// border: 1px solid grey;
display: block;
`;

const TableItem = styled.td`
padding: 5px 10px 5px 10px;
float: left;
`;

const TablePrice = styled.td`
padding: 5px 10px 5px 5px;
float: right;
`;


export default Dashboard