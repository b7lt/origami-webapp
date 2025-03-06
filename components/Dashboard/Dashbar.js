import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';

function Dashbar() {
  const { setUser } = useStateContext()

  return (
    <Nav>
      <Logo href="/dashboard">Origami</Logo>
      <Searchbar type="text" placeholder="Search"/>
      <Buttons>
        <Button href="">Account</Button>
      </Buttons>

    </Nav>
  );
};

const Nav = styled.nav`
display: flex;
// align-items: center;
padding-left: 20px;
padding-top: 15px;
padding-bottom: 15px;
text-decoration: none;
background-color: black;
border-bottom: 1px solid white;

`;

const Logo = styled(Link)`
font-size: 40px;
text-decoration: none;
color: white;
margin-left: 30px;
flex: 1;
`;

const Searchbar = styled.input`
float: right;
padding: 6px;
border: none;
// margin-top: 8px;
margin-right: 16px;
font-size: 17px;
width: 30%;
background: black;
color: white;
border: 1px solid grey;
&:hover {
    background: var(--grey-hover);
}
&:focus {
    background: var(--grey-hover);
}
outline: none;
`;

const Buttons = styled.div`
flex: 1;
display: flex;
justify-content: right;
align-items: center;
margin-right: 30px;
`;

const Button = styled(Link)`
text-decoration: none;
color: white;
&:hover {
  color: var(--lime)
}
`;

export default Dashbar;