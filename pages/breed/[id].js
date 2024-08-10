// pages/breed/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { fetchDogs } from '../../pages/api/api';
import axios from 'axios';

const BreedDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (id) {
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
      fetchDogs((data) => {
        const foundBreed = data.find((b) => b.id === parseInt(id));
        setBreed(foundBreed);
        fetchFavorites();
        setLoading(false);
      });
    }
  }, [id]);


  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please Login To Add to Favorites");
        router.push("/");
        return;
      }
  
      // Make API request to toggle favorite status
      console.log(breed.id);
      
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

  if (loading) {
    return <Container className="text-center mt-5">Loading...</Container>;
  }

  if (!breed) {
    return <Container className="text-center mt-5">Breed not found</Container>;
  }

  return (
    <Container className="mt-5">
        <Button variant="primary" onClick={() => router.back()} className="mb-4">
        &larr; Go Back
      </Button>
      <h1>{breed.name}</h1>
      <img
        src={breed.image?.url}
        alt={breed.name}
        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
      />
      <h1>{breed.name}</h1>
      <p><strong>Breed Group:</strong> {breed.breed_group || 'N/A'}</p>
      <p><strong>Temperament:</strong> {breed.temperament}</p>
      <p><strong>Weight:</strong> {breed.weight.metric} kg</p>
      <p><strong>Height:</strong> {breed.height.metric} cm</p>
      <p><strong>Life Span:</strong> {breed.life_span}</p>
      <p><strong>Origin:</strong> {breed.origin || 'N/A'}</p>
      <p><strong>Bred For:</strong> {breed.bred_for || 'N/A'}</p>
      <Button variant={favorites.includes(breed.name) ? 'danger' : 'success'} onClick={toggleFavorite}>
        {favorites.includes(breed.name) ? 'Remove from Favorites' : 'Add to Favorites'}
      </Button>
    </Container>
  );
};

export default BreedDetails;
