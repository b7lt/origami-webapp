import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { signOutUser } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import { LuOrigami } from "react-icons/lu";

function Navbar() {
  const { user, setUser } = useStateContext()
  const userLinks = !user
  ? <AccountLinks><SignIn href="/auth/login">Log in</SignIn><SignUp href="/auth/signup">Sign up</SignUp></AccountLinks>
  : <AccountLinks><SignOut onClick={() => signOutUser(setUser)}>Sign Out</SignOut></AccountLinks>

  return (
    <Nav>
      <Logo href="/">
        <LuOrigami /> <LogoText>Origami</LogoText>
      </Logo>
      {/* <Home></Home> */}
      <NavLinks>
        <ButtonLink href="/about">About us</ButtonLink>
        <ButtonLink href="/contact">Support</ButtonLink>
      </NavLinks>

      {userLinks}

    </Nav>
  );
};

const Nav = styled.nav`
display: flex;
align-items: center;
// padding-left: 20px;
padding-top: 15px;
padding-bottom: 15px;
text-decoration: none;
background-color: black;
border-bottom: 1px solid white;

`;

const Logo = styled(Link)`
display: flex;
align-items: center;
margin-left: 50px;
margin-right: 20px;
text-decoration: none;
color: white;
  svg {
    font-size: 45px;
    margin-right: 10px;
  }
`;

const LogoText = styled.p`
font-size: 35px;
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

const SignOut = styled.div`
border-radius: 25px;
background: white;
border: 2px solid white;
padding: 8px 16px 8px 16px;
color: black;
font-size: 18px;
&:hover {
  cursor: pointer;
  color: black;
  border: 2px solid gray;
  background: gray;
}
`;

export default Navbar;
