import React from 'react';
import styled from 'styled-components';
import Navbar from '@/components/LandingPage/Navbar';
import { LuOrigami } from "react-icons/lu";
import { FaBitcoin } from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';
import { FaChartLine } from "react-icons/fa";
import { MdMoneyOff } from "react-icons/md";

const About = () => {
  return (
    <PageBody>
      <Navbar />
      <AboutUsContent>
        <AboutUsHeader>About Origami</AboutUsHeader>
        
        <Section>
          <SectionTitle>Our Platform</SectionTitle>
          <Description>
            Origami is a paper trading platform designed to give you the experience of real stock and cryptocurrency 
            trading without any financial risk. We've built Origami to be simple, intuitive, and educational for 
            both beginners and experienced traders alike.
          </Description>
        </Section>
        
        <Section>
          <SectionTitle>What We Offer</SectionTitle>
          <FeatureGrid>
            <FeatureItem>
              <FeatureIcon><BsBank /></FeatureIcon>
              <FeatureTitle>Stock Trading</FeatureTitle>
              <FeatureDescription>
                Practice trading stocks and ETFs with real-time market data powered by Yahoo Finance API.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon><FaBitcoin /></FeatureIcon>
              <FeatureTitle>Crypto Trading</FeatureTitle>
              <FeatureDescription>
                Explore cryptocurrency trading with up-to-date market data from the CoinGecko API.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon><FaChartLine /></FeatureIcon>
              <FeatureTitle>Portfolio Tracking</FeatureTitle>
              <FeatureDescription>
                Monitor your portfolio performance over time with detailed charts and analytics.
              </FeatureDescription>
            </FeatureItem>
            
            <FeatureItem>
              <FeatureIcon><MdMoneyOff /></FeatureIcon>
              <FeatureTitle>Risk-Free Learning</FeatureTitle>
              <FeatureDescription>
                Gain trading experience without risking real money. Start with $100,000 in virtual cash.
              </FeatureDescription>
            </FeatureItem>
          </FeatureGrid>
        </Section>
        
        <Section>
          <SectionTitle>Market Data</SectionTitle>
          <Description>
            Origami utilizes industry-standard APIs to provide you with accurate market data:
          </Description>
          <DataSourceList>
            <DataSourceItem>
              <DataSourceName>Yahoo Finance API</DataSourceName> - For real-time stock market data and historical price information
            </DataSourceItem>
            <DataSourceItem>
              <DataSourceName>CoinGecko API</DataSourceName> - For comprehensive cryptocurrency data
            </DataSourceItem>
          </DataSourceList>
        </Section>
        
        <FooterNote>
          Disclaimer: Origami is a paper trading platform for educational purposes only. No real money is involved.
        </FooterNote>
      </AboutUsContent>
    </PageBody>
  );
};

const PageBody = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const AboutUsContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const AboutUsHeader = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  border-bottom: 1px solid #333;
  padding-bottom: 12px;
`;

const Section = styled.section`
  margin-bottom: 32px;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 0 0 16px 0;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const FeatureItem = styled.div`
  padding: 16px;
  background-color: #111;
  border-radius: 8px;
`;

const FeatureIcon = styled.div`
  color: var(--lime);
  font-size: 24px;
  margin-bottom: 12px;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  font-size: 14px;
  color: #ddd;
  line-height: 1.5;
`;

const DataSourceList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DataSourceItem = styled.li`
  margin-bottom: 12px;
  font-size: 16px;
  line-height: 1.6;
`;

const DataSourceName = styled.span`
  color: var(--lime);
  font-weight: bold;
`;

const FooterNote = styled.p`
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-top: 40px;
  font-style: italic;
`;

export default About;