//This is for pagination
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="d-flex justify-content-center">
      <Pagination>
        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
