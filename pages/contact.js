import React from 'react';
import styled from 'styled-components';
import Navbar from '@/components/LandingPage/Navbar';

const Contact = () => {
  return (
    <PageBody>
      <Navbar />
      <ContactContent>
        <ContactHeader>Contact</ContactHeader>
        
        <Section>
          <SectionTitle>Email</SectionTitle>
          <Description>
            Email the developer regarding any questions, comments, or concerns.
          </Description>
          <Email>
            arielmich64@gmail.com
          </Email>
        </Section>

        
        <FooterNote>
          Disclaimer: Origami is a paper trading platform for educational purposes only. No real money is involved.
        </FooterNote>
      </ContactContent>
    </PageBody>
  );
};

const PageBody = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: black;
  color: white;
`;

const ContactContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ContactHeader = styled.h1`
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
const Email = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
  margin-top: 32px;
  color: #bbb;
`;

const FooterNote = styled.p`
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-top: 40px;
  font-style: italic;
`;

export default Contact;