import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import AssetSearchBar from './AssetSearchBar';
import { useRouter } from 'next/router';
import { LuOrigami } from "react-icons/lu";
import { usePathname } from 'next/navigation';

function Dashbar() {
  const { setUser } = useStateContext()
  const router = useRouter();
  const currentPage = usePathname();

  const handleSelectAsset = (asset, type) => {
    if (type === 'stock') {
      // Navigate to stock details page
      router.push(`/stocks/${asset.symbol}`);
    } else if (type === 'crypto') {
      // Navigate to crypto details page
      router.push(`/cryptos/${asset.id}`);
    }
  };

  function handleLogoClick() {
    if(currentPage == "/dashboard") router.push("/");
    else router.push("/dashboard");
  }
  return (
    <Nav>
      <Left>
        <Logo onClick={() => handleLogoClick()}>
          <LuOrigami /> <LogoText>Origami</LogoText>
        </Logo>
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
align-items: center;
// padding-left: 20px;
padding-top: 15px;
padding-bottom: 15px;
text-decoration: none;
background-color: black;
border-bottom: 1px solid white;

`;

const Left = styled.div`
margin-left: 50px;
flex: 1;
`;

const Logo = styled.div`
display: flex;
align-items: center;
// margin-left: 30px;
// margin-right: 20px;
text-decoration: none;
width: 200px;
cursor: pointer;
color: white;
  svg {
    font-size: 45px;
    margin-right: 10px;
  }

  &:hover {
    color: var(--lime);
  }
`;

const LogoText = styled.p`
font-size: 35px;
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
  display: flex;
  flex: 1;
  margin: 0 16px;
  justify-content: center;
`;

export default Dashbar;