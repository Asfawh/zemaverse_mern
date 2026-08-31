/* react */
import { useContext } from 'react';
// import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

/* React Bootstrap  */
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

/* React Router Bootstrap */
import { LinkContainer } from 'react-router-bootstrap';


/* local */
import { AuthContext } from '../context/AuthContext';
import Search from './Search';
import ZemaVerseLogo from './ZemaVerseLogo';

function AppBar() {
  const { state } = useContext(AuthContext);

  return (
    <Navbar variant="dark" expand="lg" className="site-navbar">
      <Container>
        <LinkContainer to="/songs">
          <Navbar.Brand className="brand-lockup">
            <ZemaVerseLogo />
            <span>
              <strong>ZemaVerse</strong>
              <small>Lyrics in every language</small>
            </span>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="nav-menu" />
        <Navbar.Collapse id="nav-menu">
          <Nav className="me-auto site-nav-links">
            <LinkContainer to="/songs">
              <Nav.Link>Lyrics Library</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contact">
              <Nav.Link>Contact</Nav.Link>
            </LinkContainer>
            {state.user && (
              <>
                <LinkContainer to="/favorites">
                  <Nav.Link>My Favorites</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/songs/new">
                  <Nav.Link>Add Lyrics</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
          <div className="nav-utility">
            <Nav.Link className="companion-nav-link" href="https://mezmure.org/">
              <span aria-hidden="true">↔</span>
              Visit Mezmure
            </Nav.Link>
            <LinkContainer to="/support">
              <Nav.Link className="support-nav-link">
                <span aria-hidden="true">♥</span>
                Donate
              </Nav.Link>
            </LinkContainer>
            <Search />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppBar;
