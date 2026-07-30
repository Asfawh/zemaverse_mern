import { Navigate, Routes, Route } from 'react-router-dom';

import AccountBar from './components/AccountBar';

import AuthProvider from './context/AuthContext';
import AppBar from './components/AppBar';
import Main from './views/Main';
import Details from './views/Details';
import UpdateForm from './views/UpdateForm';
import MainList from './views/MainList';
import Favorites from './views/Favorites';
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
