import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import { isEmailInUse, registerUser} from '@/backend/Auth'
import Link from 'next/link'
import Navbar from '@/components/LandingPage/Navbar'

const PageStyle = createGlobalStyle`
  body {
    background-color: black;
  }
`;

const Signup = () => {

  const { user, setUser } = useStateContext()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const router = useRouter()

  async function validateEmail(){
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(emailRegex.test(email) == false ){
        return false;
    }
    console.log('so far so good...')
    const emailResponse = await isEmailInUse(email)
    console.log('email response', emailResponse)
    if(emailResponse.length == 0 ){
        return false;
    }

    return true;
}

  async function handleSignup(){
//    const isValidEmail = await validateEmail()
//     console.log('isValidEmail', isValidEmail)
//     if(!isValidEmail){ return; }
    
    try{
        await registerUser(email, password, setUser)
        router.push('/dashboard')
    }catch(err){
        console.log('Error Signing Up', err)
    }
  }


  return (
    <>
    <Section>
        <PageStyle/>
        <Header>Sign Up for Origami!</Header>
        <InputTitle>Email</InputTitle>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <InputTitle>Password</InputTitle>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

        {/*
        <UserAgreementText>By signing in, you automatically agree to our <UserAgreementSpan href='/legal/terms-of-use' rel="noopener noreferrer" target="_blank"> Terms of Use</UserAgreementSpan> and <UserAgreementSpan href='/legal/privacy-policy' rel="noopener noreferrer" target="_blank">Privacy Policy.</UserAgreementSpan></UserAgreementText>
        */}
        <MainButton onClick={handleSignup}>Sign Up</MainButton>

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


export default Signup