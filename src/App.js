import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import AuthForm from './components/Auth/AuthForm';
import FileUploadDemo  from './components/FileUploadDemo';
import { useContext } from 'react';
import AuthContext from './store/auth-context';


function App() {
  const authCtx = useContext(AuthContext);
  
  return (
    <div className="App">
      {!authCtx.isLoggedIn && <AuthForm />}
      {authCtx.isLoggedIn && <FileUploadDemo></FileUploadDemo>}
    </div>
  );
}

export default App;
