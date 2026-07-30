/* react */
import { useContext, useState } from 'react';

/* react bootstrap */
import Container from 'react-bootstrap/Container';
// import Search from './Search';

/* local */
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../users/LoginModal';
import RegisterModal from '../users/RegisterModal';
import AccountModal from './AccountModal';
import useLogout from '../users/hooks/useLogout';

function AccountBar() {
  const { state } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const logout = useLogout();

  const username = state.user ? state.user.username : null;
  const options = state.user ? ['logout'] : ['login', 'register'];

  const handleClose = (modalName) => {
    switch (modalName) {
      case 'login':
        setShowLogin(false);
        break;
      case 'register':
        setShowRegister(false);
        break;
      default:
        console.error('Unexpected modalName');
        break;
    }
  };

  const handleSelect = (e) => {
    switch (e) {
      case 'login':
        setShowLogin(true);
        break;
      case 'register':
        setShowRegister(true);
        break;
      case 'logout':
        logout();
        break;
      default:
        console.error('Unexpected eventKey');
        break;
    }
  };

  return (
    <div className="account-strip">
      <Container>
        <div className="account-strip-inner">
          <span className="account-welcome">
            {username ? `Welcome back, ${username}` : 'Join the community to add and manage ZemaVerse'}
          </span>
          <AccountModal
            title={`${username ? username : 'Login or Register'}`}
            options={options}
            handleSelect={handleSelect}
          />
        </div>
      </Container>

      <LoginModal showLogin={showLogin} handleClose={handleClose} />
      <RegisterModal showRegister={showRegister} handleClose={handleClose} />
    </div>
  );
}

export default AccountBar;
