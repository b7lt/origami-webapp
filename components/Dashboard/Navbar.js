import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import Home from '@/components/Dashboard/Home'
const Navbar = () => {
  const { setUser } = useStateContext()

  return (
    <Nav>
      <Logo onClick={() => logOut(setUser)} href="/">Origami</Logo>
      {/* <Home></Home> */}
      <NavLinks>
        <ButtonLink href="">About us</ButtonLink>
        <ButtonLink href="">Support</ButtonLink>
      </NavLinks>

      <AccountLinks>
        <SignIn href="">Log in</SignIn>
        <SignUp href="">Sign up</SignUp>
      </AccountLinks>

    </Nav>
  );
};

const Nav = styled.nav`
display: flex;
align-items: center;
padding-left: 20px;
padding-top: 5px;
padding-bottom: 10px;
text-decoration: none;
background-color: black;
border-bottom: 2px solid white;

`;

const Logo = styled(Link)`
font-size: 40px;
text-decoration: none;
color: white;
`;

const NavLinks = styled.div`
display: flex;
text-align: center;
`;

const ButtonLink = styled(Link)`
font-size: 20px;
margin-left: 36px;
text-decoration: none;
color: white;
&:hover {
  color:rgb(119, 236, 126);
}
`;

const AccountLinks = styled(NavLinks)`
position: absolute;
right: 0;
padding-right: 10px;
`;

const SignIn = styled(ButtonLink)`
border-radius: 25px;
border: 2px solid white;
padding: 8px 16px 8px 16px;
&:hover {
  color: white;
  border: 2px solid gray;
}
`;

const SignUp = styled(ButtonLink)`
border-radius: 25px;
background: white;
border: 2px solid white;
padding: 8px 16px 8px 16px;
color: black;
&:hover {
  color: black;
  border: 2px solid gray;
  background: gray;
}
`;

export default Navbar;
