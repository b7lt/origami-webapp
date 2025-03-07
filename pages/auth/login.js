import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import {signInUser, isEmailInUse} from '@/backend/Auth'
import Link from 'next/link'
import Navbar from '@/components/LandingPage/Navbar'

const PageStyle = createGlobalStyle`
  body {
    background-color: black;
  }
`;

const Login = () => {

  const { user, setUser } = useStateContext()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const router = useRouter()


  async function handleLogin() {
    try {
      await signInUser(email, password, setUser);
      // Only redirect after successful authentication
      router.push('/dashboard');
    } catch (err) {
      console.log('Error Signing In', err);
    }
  }


  return (
    <>
    <Section>
        <PageStyle/>
        <Header>Sign In to Origami!</Header>
        <InputTitle>Email</InputTitle>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <InputTitle>Password</InputTitle>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

        {/*
        <UserAgreementText>By signing in, you automatically agree to our <UserAgreementSpan href='/legal/terms-of-use' rel="noopener noreferrer" target="_blank"> Terms of Use</UserAgreementSpan> and <UserAgreementSpan href='/legal/privacy-policy' rel="noopener noreferrer" target="_blank">Privacy Policy.</UserAgreementSpan></UserAgreementText>
        */}
        <MainButton onClick={handleLogin}>Sign In</MainButton>

    </Section>
    </>
  )
}



const Section = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  height: 50%;
  position: relative;
  top: 50%;
  transform: translateY(50%);

  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.h1`
  font-weight: 300;
  font-size: 40px; /* Adjusted for better scalability */
  margin-bottom: 20px;
`;

const Input = styled.input`
  font-size: 16px;
  margin-bottom: 10px;

`;

const InputTitle = styled.label` /* Changed to label for semantics */
  font-size: 18px;
`;

const MainButton = styled.button`
  font-size: 16px;
  margin-top: 5px;
  width: 10%;
`;

const UserAgreementText = styled.p`
  font-size: 12px;
`;

const UserAgreementSpan = styled(Link)` 
  color: #007bff;

`;


export default Login