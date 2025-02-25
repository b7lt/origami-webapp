import Hero from "@/components/LandingPage/Hero"
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import SignUp from "@/components/Dashboard/Navbar"
import Footer from "@/components/LandingPage/Footer"
import Link from "next/link"
export default function Home() {
  return (
    <>
        <Navbar/>
        {/* <Hero text={'WELCOME TO MY CLASS'} />
        <Hero /> */}
        <Main>
          <Header>Paper Trading</Header>
          <Subheader>Made <span style={{color: "rgb(119, 236, 126);"}}>simple</span>.</Subheader>
          {/* <SignUp>Test</SignUp> */}
          <GetStarted href="">Get started</GetStarted>
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
margin-top: 50px;
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