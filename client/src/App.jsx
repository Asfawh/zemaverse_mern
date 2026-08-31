import { Navigate, Routes, Route } from 'react-router-dom';

import AccountBar from './components/AccountBar';

import AuthProvider from './context/AuthContext';
import AppBar from './components/AppBar';
import Main from './views/Main';
import Details from './views/Details';
import UpdateForm from './views/UpdateForm';
import MainList from './views/MainList';
import Favorites from './views/Favorites';
import Support from './views/Support';
import About from './views/About';
import Contact from './views/Contact';
import Privacy from './views/Privacy';
import Terms from './views/Terms';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <AppBar />
        <AccountBar />
        <main className="site-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Navigate to="/songs" />} />
              <Route path="/songs" element={<MainList />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/support" element={<Support />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/songs/new" element={<Main />} />
              <Route path="/songs/:id" element={<Details />} />
              <Route path="/songs/:id/edit" element={<UpdateForm />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
