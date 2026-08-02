import TopBar from './TopBar';
import NavBar from './NavBar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

export default function PageLayout({ children, hideTopBar = false, hideNavBar = false }) {
  const { isAdmin } = useAuth();
  const showTopBar = !hideTopBar && !isAdmin; // topbar is customer-only context — never for admin, never pre-login

  return (
    <>
      {showTopBar && <TopBar />}
      {!hideNavBar && <NavBar />}
      {children}
      <Footer />
    </>
  );
}