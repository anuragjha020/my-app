import "../styles/Pagination.css";

function Pagination({ totalPages, currentPage, onPageChange }) {
  return (
    totalPages > 1 && (
      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={currentPage === 1 ? "disabled" : ""}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={currentPage === totalPages ? "disabled" : ""}
        >
          Next
        </button>
      </div>
    )
  );
}

export default Pagination;
