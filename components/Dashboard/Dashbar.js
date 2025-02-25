import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';

const Dashbar = () => {
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