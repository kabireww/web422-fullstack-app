// components/BreedCard.js
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import styles from './BreedCard.module.css';

const BreedCard = ({ breed, isFavorite, onToggleFavorite }) => {
  return (
    <Card className={styles.card}>
      <div className={styles.cardImageContainer}>
        <Card.Img
          variant="top"
          src={breed.image?.url}
          className={styles.cardImage}
          alt={breed.name}
        />
        <div className={styles.favoriteIcon} onClick={() => onToggleFavorite(breed)}>
          <FontAwesomeIcon
            icon={faHeart}
            color={isFavorite ? 'red' : 'white'}
            size="lg"
          />
        </div>
      </div>
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styles.cardTitle}>{breed.name}</Card.Title>
        <Card.Text className={styles.cardText}>{breed.temperament}</Card.Text>
        <div className={styles.actions}>
          <Link href={`/breed/${breed.id}`} legacyBehavior>
            <a className={styles.learnMore}>Learn More</a>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BreedCard;
