import "../styles/Button.css";

function Button({ children, onClick, type, variant }) {
  return (
    <button type={type} onClick={onClick} className={`button ${variant}`}>
      {children}
    </button>
  );
}

export default Button;
