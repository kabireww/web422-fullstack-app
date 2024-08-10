import { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import SearchBar from '../components/SearchBar';
import BreedCard from '../components/BreedCard';
import PaginationComponent from '../components/Pagination';
import { fetchDogs } from '../pages/api/api';
import Login from '@/components/Login';
import Register from '@/components/Register';
import axios from 'axios';


const Home = () => {
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('home');
  const [favorites, setFavorites] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setFavorites([]);
        return;
      }
  
      try {
        const response = await axios.get('https://web422-backend.onrender.com/api/users/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status == 200) {
          console.log(response.data.favorites);
          const favorin = response.data.favorites;
          setFavorites(favorin);
          console.log(favorites);
          
          
        } else {
          setFavorites([]);  // Set an empty array if no favorites are returned
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavorites([]);  // Set an empty array in case of an error
      }
    };
  
    setLoggedInUser();
    fetchFavorites();
  }, []);
  

  useEffect(() => {
    if (activeTab === 'home') {
      fetchDogs((data) => {
        setBreeds(data);
        setFilteredBreeds(data);
        setTotalPages(Math.ceil(data.length / 20));
      });
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Clear user data
    localStorage.removeItem('token'); // Clear user data
    setUserEmail(null);
    setFavorites([]);
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);


  useEffect(() => {
    if (query === '') {
      setFilteredBreeds(breeds);
      setTotalPages(Math.ceil(breeds.length / 20));
    } else {
      const filtered = breeds.filter((breed) =>
        breed.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBreeds(filtered);
      setTotalPages(Math.ceil(filtered.length / 20));
    }
    setCurrentPage(1); // Reset to first page when query changes
  }, [query, breeds]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setActiveTab('search');
  };
  const resetSearch = () => {
    setQuery(''); // Clear the search query
    setActiveTab('home'); // Switch to the home tab
    setFilteredBreeds(breeds); // Reset the filtered breeds to show all breeds
    setCurrentPage(1); // Reset pagination to the first page
  };

  const toggleFavorite = async (breed) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setActiveTab('login'); // Redirect to login if not authenticated
        return;
      }
  
      // Make API request to toggle favorite status
      const response = await axios.post(
        'https://web422-backend.onrender.com/api/users/favorites',
        {
          itemId: breed.name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update local state based on the response
      setFavorites((prevFavorites) => {
        if (prevFavorites.includes(breed.name)) {
          return prevFavorites.filter((id) => id !== breed.name);
        } else {
          return [...prevFavorites, breed.name];
        }
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Handle error appropriately (e.g., show an error message)
    }
  };
  
  

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderBreeds = (breedsToDisplay) => {
    // Render breed cards
    if (breedsToDisplay.length === 0) {
      return (
        <Container className="text-center mt-5">
          <h4>Breed not found</h4>
        </Container>
      );
    }

    return (
      <Row>
        {breedsToDisplay.map((breed) => (
          <Col key={breed.id} sm={12} md={6} lg={3}>
            <BreedCard
              breed={breed}
              isFavorite={favorites.includes(breed.name)}
              onToggleFavorite={toggleFavorite}
            />
          </Col>
        ))}
      </Row>
    );
  };
  const renderContent = () => {
    if (activeTab === 'home' || activeTab === 'search') {
      // Display breeds for home and search tabs
      const breedsToDisplay = filteredBreeds.slice((currentPage - 1) * 20, currentPage * 20);
      return (
        <>
          <SearchBar onSearch={handleSearch} />
          {renderBreeds(breedsToDisplay)}
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            position="bottom"
          />
        </>
      );
    } else if (activeTab === 'favorites') {
      // Display favorite breeds
      const favoriteBreeds = breeds.filter((breed) => favorites.includes(breed.name));
      return (
        <>
          <h2>Your Favorite Breeds</h2>
          {renderBreeds(favoriteBreeds)}
        </>
      );
    } else if (activeTab === 'about') {
      // Display about us content
      return (
        <Container className="about" id="about">
          <h2>About Us</h2>
          <p>
            Welcome to DogInfo! This platform provides comprehensive and insightful reviews on various dog breeds. Whether you&apos;re a dog lover or a potential pet owner, we have something for everyone. Our goal is to help you discover and learn more about different dog breeds through detailed reviews and information.
          </p>
        </Container>
      );
    } else if (activeTab == 'login') {
      return (
        <>
          <h2>Your Favorite Breeds</h2>
          <Login setActiveTab={setLoggedInUser} />
        </>
      );
    }
    else if (activeTab == 'register') {
      return (<>
        <h2>Your Favorite Breeds</h2>
        <Register setActiveTab={setLoggedInUser} />
      </>);
    }
  };

  const setLoggedInUser = () =>{
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
    setActiveTab('home');

  }

  return (
    <>
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="#" onClick={resetSearch}>DogInfo</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" onClick={resetSearch}>Home</Nav.Link>
              <Nav.Link href="#" onClick={() => setActiveTab('favorites')}>Favorites</Nav.Link>
              <Nav.Link href="#" onClick={() => setActiveTab('about')}>About Us</Nav.Link>
              <Nav.Link href="#" onClick={() => setActiveTab('search')}>Search</Nav.Link>
              {userEmail ? (
                <>
                  <Nav.Link href="#" disabled>Welcome, {userEmail}</Nav.Link>
                  <Nav.Link href="#" onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="#" onClick={() => setActiveTab('login')}>Log In</Nav.Link>
                  <Nav.Link href="#" onClick={() => setActiveTab('register')}>Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="header">
        <h1>Welcome to DogInfo</h1>
      </Container>

      <Container>
        {renderContent()}
      </Container>

      <footer className="footer">
        <Container>
          <Row>
            <Col md={6}>
              <span>&copy; 2024 Web project. All rights reserved.</span>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Home;