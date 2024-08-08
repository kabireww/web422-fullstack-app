// components/SearchBar.js
//This is just for search bar
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <Form className="d-flex mb-4">
      <Form.Control
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter dog breeds name...."
        className="me-2"
      />
      <Button onClick={handleSearch} variant="primary">Search</Button>
    </Form>
  );
};

export default SearchBar;
