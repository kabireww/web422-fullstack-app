// pages/breed/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { fetchDogs } from '../../pages/api/api';

const BreedDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (id) {
      fetchDogs((data) => {
        const foundBreed = data.find((b) => b.id === parseInt(id));
        setBreed(foundBreed);
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    // Load favorites from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = () => {
    const updatedFavorites = favorites.includes(breed.id)
      ? favorites.filter((favId) => favId !== breed.id)
      : [...favorites, breed.id];
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
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
      <Button variant={favorites.includes(breed.id) ? 'danger' : 'success'} onClick={toggleFavorite}>
        {favorites.includes(breed.id) ? 'Remove from Favorites' : 'Add to Favorites'}
      </Button>
    </Container>
  );
};

export default BreedDetails;
