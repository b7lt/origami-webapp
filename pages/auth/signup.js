import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import { isEmailInUse, registerUser } from '@/backend/Auth'
import Link from 'next/link'
import Navbar from '@/components/LandingPage/Navbar'
import { LuOrigami } from "react-icons/lu";

const PageStyle = createGlobalStyle`
  body {
    background-color: black;
    overflow: auto;
  }
`;

const Signup = () => {
  const { user, setUser } = useStateContext()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ errorMessage, setErrorMessage ] = useState('')

  const router = useRouter()

  async function validateEmail() {
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    try {
      const emailUsed = await isEmailInUse(email);
      if (emailUsed) {
        setErrorMessage('This email is already in use. Please use a different email or sign in.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking email:', error);
      setErrorMessage('An error occurred. Please try again.');
      return false;
    }
  }

  async function handleSignup(e) {
    if (e) e.preventDefault();
    
    setLoading(true);
    setErrorMessage('');
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    const isValidEmail = await validateEmail();
    if (!isValidEmail) {
      setLoading(false);
      return;
    }
    
    try {
      await registerUser(email, password, setUser);
      router.push('/dashboard');
    } catch (err) {
      console.log('Error Signing Up', err);
      setErrorMessage('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageStyle/>
      <FormBody>
        <FormDiv>
          <LogoDiv>
            <LogoIcon onClick={() => router.push("/")}><LuOrigami /></LogoIcon>
          </LogoDiv>
          
          <FormHeader>Create your Origami account</FormHeader>
          
          <Form onSubmit={handleSignup}>
            <FormGroup>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Password</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
              />
            </FormGroup>
            
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            
            <SubmitButton 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </SubmitButton>
          </Form>
          
          <SigninLink>
            Already have an account? <Link href="/auth/login">Sign in</Link>
          </SigninLink>
        </FormDiv>
      </FormBody>
    </>
  )
}

const FormBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const FormDiv = styled.div`
  background-color: #111;
  border: 1px solid #333;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

const LogoDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const LogoIcon = styled.div`
  font-size: 48px;
  color: var(--lime);
  
  svg {
    display: block;
  }

  &:hover {
    cursor: pointer;
  }
`;

const FormHeader = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: white;
  text-align: center;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #ddd;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  background-color:rgb(26, 26, 26);
  border: 1px solid #333;
  color: white;
  font-size: 16px;
  
  &:focus {
    outline: none;
    background: var(--grey-hover);
    border-color: white;
  }
  
  &::placeholder {
    color: #555;
  }
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 12px;
  border-radius: 4px;
  background-color: var(--lime);
  color: black;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: var(--orange);
  font-size: 14px;
  text-align: center;
`;

const SigninLink = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #999;
  
  a {
    color: var(--lime);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Signup