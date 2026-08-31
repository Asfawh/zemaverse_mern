import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <Container className="footer-grid">
        <div>
          <span className="footer-brand">ZemaVerse</span>
          <p>Celebrating Ethiopian music, artists, languages, and the lyrics that connect generations.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/songs">Song Library</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/support">Support ZemaVerse</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <small>© {new Date().getFullYear()} ZemaVerse.com</small>
      </Container>
    </footer>
  );
}

export default Footer;
