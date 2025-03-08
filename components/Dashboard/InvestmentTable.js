import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const formatMoney = (amount, currencyCode = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

function InvestmentTable(props) {
    const rows = [];

    props.investments.forEach((investment) => {
        rows.push(
            <TableRow className={props.id == "stocks" ? "stock" : "crypto"} key={investment.name}>
                <TableItem>
                  <InvestmentName>{investment.name}</InvestmentName>
                  <InvestmentShares>{investment.shares} {props.id == "stocks" ? "shares" : "coins"}</InvestmentShares>
                </TableItem>
                <TablePrice>{formatMoney(investment.latestPrice)}</TablePrice>
             </TableRow>
        );
    });

    return(
        <Table id={props.id}>
            <TableHead>
            <TableRow>
                <TableHeader>{props.name}</TableHeader>
            </TableRow>
            </TableHead>
            <TableBody>
                {rows}
            </TableBody>
        </Table>
    );
};

const Table = styled.table`
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
font-size: 18px;
padding-top: 12px;
padding-bottom: 12px;
// margin-top: 20px;
`;

const TableBody = styled.tbody`
`;

const TableRow = styled.tr`
// border: 1px solid grey;
// display: block;
margin-top: 10px;
align-items: center;

&.stock:hover, &.crypto:hover {
  background-color: var(--grey-hover)
}
`;

const TableItem = styled.td`
padding: 6px 10px 6px 10px;
float: left;
display: flex;
flex-direction: column;
`;

const TablePrice = styled.td`
padding: 8px 10px 8px 5px;
float: right; 
`;

const InvestmentName = styled.p`
`;

const InvestmentShares = styled.p`
color:rgb(191, 191, 191);
`;

export default InvestmentTable;