import { Menubar } from 'primereact/menubar';
import { PrimeIcons } from 'primereact/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../../store/auth-context';

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authCtx = useContext(AuthContext);
  
  const loggedInItems = [
    {
      label: 'Acasa',
      icon: PrimeIcons.HOME,
      command: () => { navigate('/home'); },
    }, 
    {
      label: 'Albume',
      icon: PrimeIcons.IMAGES,
      items: [
        {
          label: 'Vizualizează albumele',
          icon: PrimeIcons.EYE,
          command: () => { navigate('/albums') }
        },
        {
          label: 'Crează un album',
          icon: PrimeIcons.PENCIL,
          command: () => { navigate('/albums/new') }
        }
      ],
    },
    {
      label: 'Detectie Live',
      icon: PrimeIcons.VIDEO,
      command: () => {  },
    }, 
    {
      label: 'Iesi din cont',
      icon: PrimeIcons.SIGN_OUT,
      command: () => { 
        navigate('/');
        authCtx.logout();
      },
    }
  ]

  const notLoggedInItems = [
    {
      label: 'Acasa',
      icon: PrimeIcons.HOME,
      command: () => { navigate('/home') },
    },
    {
      label: 'Inregistrare',
      icon: PrimeIcons.SIGN_IN,
      command: () => { navigate('/register') },
    },
    {
      label: 'Autentificare',
      icon: PrimeIcons.SIGN_IN,
      command: () => { navigate('/auth') },
    }
  ]

  const menuItems = authCtx.isLoggedIn ? loggedInItems : notLoggedInItems
  return (
    <header>
      <Menubar model={menuItems} />
    </header>
  );
};

export default MainNavigation;