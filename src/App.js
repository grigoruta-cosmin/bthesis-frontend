import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "primeflex/primeflex.css";
import AuthForm from './components/Auth/AuthForm';
import FileUploadDemo  from './components/FileUploadDemo';
import { useContext } from 'react';
import AuthContext from './store/auth-context';
import MainNavigation from './components/Layout/MainNavigation';
import { Route, Routes } from 'react-router-dom';
import Albums from './pages/Albums';
import Home from './pages/Home';
import Layout from './components/Layout/Layout';
import RegisterForm from './components/Auth/RegisterForm';
import NotFound from './pages/NotFound';
import NewAlbum from './pages/NewAlbum';
import Images from './pages/Images';
import AlbumItem from './components/Albums/AlbumItem';

function App() {
  const authCtx = useContext(AuthContext);
  
  return (
    <Layout>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/home' element={ <Home /> } />
        { 
          authCtx.isLoggedIn && (
            <>
              <Route path='/albums' element={ <Albums /> } />
              <Route path='/albums/new' element={ <NewAlbum />} />
              <Route path='/albums/:albumId' element={ <AlbumItem />} />
              <Route path='/albums/:albumId/images' element={ <Images />} />
            </>
          )
        }
        {
          !authCtx.isLoggedIn && (
            <>
              <Route path='/register' element={ <RegisterForm />} />
              <Route path='/auth' element={ <AuthForm /> } />
            </>
          )
        }
        <Route path='*' element={ <NotFound /> } />
      </Routes>
    </Layout>
    // <div className="App">
    //   <MainNavigation />
    //   {!authCtx.isLoggedIn && <AuthForm />}
    //   {authCtx.isLoggedIn && <FileUploadDemo></FileUploadDemo>}
    // </div>
  );
}

export default App;
