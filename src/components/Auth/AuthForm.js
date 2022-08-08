import { useContext, useRef } from 'react';

import useInput from '../../hooks/use-input';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import AuthContext from '../../store/auth-context';

const isNotEmpty = (value) => value.trim() !== '';

const AuthForm = (props) => {
  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsername
  } = useInput(isNotEmpty);
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword
  } = useInput(isNotEmpty);
  const toastRef = useRef();
  const authCtx = useContext(AuthContext);

  let formIsValid = false;

  if (usernameIsValid && passwordIsValid) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();
    
    if (!formIsValid) {
      return;
    }

    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.ok) {
        toastRef.current.show({severity: 'info', summary: 'Success', detail: 'Authentication done'})
        return res.json();
      } else {
        return res.json().then((data) => {
          toastRef.current.show({severity: 'error', summary: 'Error', detail: data.message})
        })
      }
    }).then((data) => {
      const expirationTime = new Date(
        new Date().getTime() + 3600 * 1000
      );
      authCtx.login(data.access_token, expirationTime.toISOString());
      console.log(data)
    });

    resetUsername();
    resetPassword();
  }

  const usernameClasses = usernameHasError ? 'p-invalid block' : 'block'
  const passwordClasses = passwordHasError ? 'p-invalid block' : 'block'

  return (
    <div className='card'>
      <Toast ref={toastRef} />
      <form onSubmit={submitHandler}>
        <div className='field'>
          <label htmlFor='username' className='block'>Username</label>
          <InputText
            id='username'
            aria-describedby='username-help'
            className={usernameClasses}
            value={usernameValue}
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
          />
          {usernameHasError && <small id='username-help' className='p-error block' >Username is required</small>} 
        </div>
        <div className='field'>
          <label htmlFor='password' className='block'>Password</label>
          <Password
            id='password'
            aria-describedby='password-help'
            className={passwordClasses}
            value={passwordValue}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
          />
          {passwordHasError && <small id='password-help' className='p-error block'>Password is required</small>}
        </div>
        <Button type="submit" label="Login" aria-label="Login"  />
      </form>
    </div>
  );
};

export default AuthForm;