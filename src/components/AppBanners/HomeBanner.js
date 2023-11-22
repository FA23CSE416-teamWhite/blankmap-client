
import * as React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function HomeBanner() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  const performSearch = () => {
    // Update the URL with the new query string
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  return (

    <Box width="100%" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSearchSubmit} style={{
        width: '30%',
      }}>
        <input
          type="text"
          placeholder="Search Maps"
          onChange={handleSearchChange}
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
            width: '100%',
          }}
        />
      </form>
      <button type="button" onClick={performSearch} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <SearchIcon sx={{ ml: '1rem' , color: 'white'}} />
        </button>
    </Box>

  );
}