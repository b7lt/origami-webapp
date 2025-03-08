import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BsSearch } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { FaBitcoin } from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';

const AssetSearchBar = ({ onSelectAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({ stocks: [], cryptos: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);
  const timerRef = useRef(null);

  // close when clikc outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // if serach bar has content and click was not in the container
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // handle search term changes with a timer
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (searchTerm.trim() === '') {
      setResults({ stocks: [], cryptos: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // timer for 500ms to avoid spamming the API
    timerRef.current = setTimeout(() => {
      fetchAssetResults(searchTerm);
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchTerm]);

  const fetchAssetResults = async (term) => {
    try {
      const response = await fetch('/api/assetsearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: term,
          searchType: 'both'
        }),
      });

      if (!response.ok) {
        throw new Error('error /api/assetsearch');
      }

      const data = await response.json();

      setResults({
        stocks: data.stocks,
        cryptos: data.cryptos
      });
      
      setShowResults(true);

    } catch (error) {
      console.error('Error searching assets:', error);
      setResults({ stocks: [], cryptos: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setResults({ stocks: [], cryptos: [] });
    setShowResults(false);
  };

  const handleSelectAsset = (asset, type) => {
    if (onSelectAsset) {
      onSelectAsset(asset, type);
    }
    setSearchTerm(asset.symbol || asset.id);
    setShowResults(false);
  };

  const hasResults = results.stocks.length > 0 || results.cryptos.length > 0;

  return (
    <SearchContainer ref={searchRef}>
      <SearchInputContainer>
        <SearchIcon>
          <BsSearch />
        </SearchIcon>

        <SearchInput
          type="text"
          placeholder="Search for stocks and cryptocurrencies..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm && setShowResults(true)}
        />
        
        {searchTerm && (
          <ClearButton onClick={handleClearSearch}>
            <IoMdClose />
          </ClearButton>
        )}
      </SearchInputContainer>

      {showResults && (
        <ResultsContainer>
          {loading ? (
            <LoadingMessage>Searching...</LoadingMessage>
          ) : hasResults ? 
          (
            <ResultsList>
              {results.stocks.length > 0 && 
              (
                <>
                  {<CategoryLabel><BsBank /> Stocks</CategoryLabel>}
                  {results.stocks.map((stock) => (
                    <ResultItem 
                      key={`stock-${stock.symbol}-${stock.exchange}`} 
                      onClick={() => handleSelectAsset(stock, 'stock')}
                    >
                      <AssetIcon><BsBank /></AssetIcon>
                      <AssetSymbol>{stock.symbol}</AssetSymbol>
                      <AssetName>{stock.shortname || stock.longname}</AssetName>
                      <AssetExchange>{stock.exchange}</AssetExchange>
                    </ResultItem>
                  ))}
                </>
              )}
              
              {results.cryptos.length > 0 && 
              (
                <>
                  {results.stocks.length > 0 && <Divider />}
                  {<CategoryLabel><FaBitcoin /> Cryptocurrencies</CategoryLabel>}
                  {results.cryptos.map((crypto) => (
                    <ResultItem 
                      key={`crypto-${crypto.id}`} 
                      onClick={() => handleSelectAsset(crypto, 'crypto')}
                    >
                      <AssetIcon><FaBitcoin /></AssetIcon>
                      <AssetSymbol>{crypto.symbol?.toUpperCase()}</AssetSymbol>
                      <AssetName>{crypto.name}</AssetName>
                      <CryptoRank>#{crypto.market_cap_rank || 'N/A'}</CryptoRank>
                    </ResultItem>
                  ))}
                </>
              )}
            </ResultsList>
          ) : searchTerm ? (
            <NoResultsMessage>No results found</NoResultsMessage>
          ) : null}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 640px;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: #777;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid grey;
  border-radius: 4px;
  font-size: 16px;
  background: black;
  color: white;
  outline: none;
  
  &:hover, &:focus {
    background: var(--grey-hover);
    border-color: white;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: white;
  }
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #111;
  border: 1px solid grey;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 10;
`;

const ResultsList = styled.div`
  max-height: 330px;
  overflow-y: auto;
`;

const CategoryLabel = styled.div`
  padding: 10px 12px;
  font-size: 14px;
  color: #aaa;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  gap: 6px;
  
  svg {
    font-size: 15px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #333;
  margin: 4px 0;
`;

const ResultItem = styled.div`
  padding: 12px;
  cursor: pointer;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 12px;
  align-items: center;
  
  &:hover {
    background: var(--grey-hover);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #222;
  }
`;

const AssetIcon = styled.span`
  color: #777;
  font-size: 16px;
  display: flex;
  align-items: center;
`;

const AssetSymbol = styled.span`
  font-weight: bold;
  color: var(--lime);
`;

const AssetName = styled.span`
  color: #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AssetExchange = styled.span`
  color: #777;
  font-size: 0.8rem;
`;

const CryptoRank = styled.span`
  color: #777;
  font-size: 0.8rem;
`;

const LoadingMessage = styled.div`
  padding: 12px;
  text-align: center;
  color: #ddd;
`;

const NoResultsMessage = styled.div`
  padding: 12px;
  text-align: center;
  color: #777;
`;

export default AssetSearchBar;