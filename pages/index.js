import { styled } from 'styled-components'
import Navbar from "@/components/LandingPage/Navbar"
import Footer from "@/components/LandingPage/Footer"
import Link from "next/link"
import { useStateContext } from '@/context/StateContext';


export default function Home() {
  const { user } = useStateContext();
  const MainButton = !user ? <GetStarted href="/auth/signup">Get started</GetStarted> : <GetStarted href="/dashboard">Go to Dashboard</GetStarted>

  return (
    <>
        <Navbar/>
        <Main>
          <Header>Paper Trading</Header>
          <Subheader>Made <span style={{color: "var(--lime)"}}>simple</span>.</Subheader>
          {/* <SignUp>Test</SignUp> */}
          {MainButton}
        </Main>

        {/* <Footer /> */}

    </>
  )
}

const Main = styled.div`
position: absolute;
width: 100%;
height: 50%;

display: flex;
flex-direction: column;
align-items: center;
color: white;
text-align: center;
font-weight: normal;

`;

const Header = styled.h1`
font-weight: normal;
margin-top: 100px;
font-size: 65px;
`;

const Subheader = styled.h2`
font-weight: normal;
font-size: 30px;
margin-bottom: 20px;
`;

const GetStarted = styled(Link)`
font-size: 20px;
text-decoration: none;
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