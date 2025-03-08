import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import AssetSearchBar from './AssetSearchBar';
import { useRouter } from 'next/router';

function Dashbar() {
  const { setUser } = useStateContext()
  const router = useRouter();

  const handleSelectAsset = (asset, type) => {
    if (type === 'stock') {
      // Navigate to stock details page
      router.push(`/stocks/${asset.symbol}`);
    } else if (type === 'crypto') {
      // Navigate to crypto details page
      router.push(`/cryptos/${asset.id}`);
    }
  };

  return (
    <Nav>
      <Left>
        <Logo href="/">Origami</Logo>
      </Left>
      <SearchContainer>
        <AssetSearchBar onSelectAsset={handleSelectAsset} />
      </SearchContainer>
      <Buttons>
        <Button href="">Account</Button>
      </Buttons>

    </Nav>
  );
};

const Nav = styled.nav`
display: flex;
// align-items: center;
padding-left: 20px;
padding-top: 15px;
padding-bottom: 15px;
text-decoration: none;
background-color: black;
border-bottom: 1px solid white;

`;

const Left = styled.div`
margin-left: 30px;
flex: 1;
`;

const Logo = styled(Link)`
font-size: 40px;
text-decoration: none;
color: white;
// margin-left: 30px;
// flex: 1;
`;

const Searchbar = styled.input`
float: right;
padding: 6px;
border: none;
// margin-top: 8px;
margin-right: 16px;
font-size: 17px;
width: 30%;
background: black;
color: white;
border: 1px solid grey;
&:hover {
    background: var(--grey-hover);
}
&:focus {
    background: var(--grey-hover);
}
outline: none;
`;

const Buttons = styled.div`
flex: 1;
display: flex;
justify-content: right;
align-items: center;
margin-right: 30px;
`;

const Button = styled(Link)`
text-decoration: none;
color: white;
&:hover {
  color: var(--lime)
}
`;

const SearchContainer = styled.div`
  flex: 1;
  margin: 0 16px;
`;

export default Dashbar;