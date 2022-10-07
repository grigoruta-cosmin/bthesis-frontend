import { useContext, useRef } from "react";
import AuthContext from "../../store/auth-context";

import useInput from "../../hooks/use-input";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

const isNotEmpty = (value) => value.trim().length >= 3;
const passwordCheck = (value) => value.trim().length >= 8;

const RegisterForm = () => {
  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstName,
  } = useInput(isNotEmpty);
  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastName,
  } = useInput(isNotEmpty);
  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    valueChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsername,
  } = useInput(isNotEmpty);
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(passwordCheck);
  const toastRef = useRef();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  let formIsValid = false;

  if (
    firstNameIsValid &&
    lastNameIsValid &&
    usernameIsValid &&
    passwordIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    fetch("/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: firstNameValue,
        last_name: lastNameValue,
        username: usernameValue,
        password: passwordValue,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          toastRef.current.show({
            severity: "info",
            summary: "Succes",
            detail: "Inregistrare reusita",
          });
          return res.json();
        } else {
          return res.json().then((data) => {
            toastRef.current.show({
              severity: "error",
              summary: "Eroare",
              detail: data.message,
            });
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(new Date().getTime() + 3600 * 1000);
        authCtx.login(data.access_token, expirationTime.toISOString());
        navigate('/home');
      });

    resetFirstName();
    resetLastName();
    resetUsername();
    resetPassword();
  };

  const firstNameClasses = firstNameHasError ? "p-invalid w-full mb-3" : "w-full mb-3";
  const lastNameClasses = lastNameHasError ? "p-invalid w-full mb-3" : "w-full mb-3";
  const usernameClasses = usernameHasError ? "p-invalid w-full mb-3" : "w-full mb-3";
  const passwordClasses = passwordHasError ? "p-invalid w-full mb-3" : "w-full mb-3";

  return (
    <>
      <div className="card">
        <div className="flex align-items-center justify-content-center mt-8">
          <Toast ref={toastRef} />
          <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
            <div className='text-center mb-5'>
              <div className="text-900 text-3xl font-medium mb-3">Bine ai venit</div>
              <span className="text-600 font-medium line-height-3">Crează-ți un cont!</span>
            </div>
            <div>
              <form onSubmit={submitHandler}>
                <div className="field">
                  <label htmlFor="firstName" className="block text-900 font-medium mb-2">
                    Prenume
                  </label>
                  <InputText
                    id="firstName"
                    aria-describedby="firstName-help"
                    className={firstNameClasses}
                    value={firstNameValue}
                    onChange={firstNameChangeHandler}
                    onBlur={firstNameBlurHandler}
                  />
                  {firstNameHasError && (
                    <small id="firstName-help" className="p-error block">
                      Câmpul Prenume este obligatoriu
                    </small>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="lastName" className="block text-900 font-medium mb-2">
                    Nume
                  </label>
                  <InputText
                    id="lastName"
                    aria-describedby="lastName-help"
                    className={lastNameClasses}
                    value={lastNameValue}
                    onChange={lastNameChangeHandler}
                    onBlur={lastNameBlurHandler}
                  />
                  {lastNameHasError && (
                    <small id="lastName-help" className="p-error block">
                      Câmpul Nume este obligatoriu
                    </small>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="username" className="block text-900 font-medium mb-2">
                    Username
                  </label>
                  <InputText
                    id="username"
                    aria-describedby="username-help"
                    className={usernameClasses}
                    value={usernameValue}
                    onChange={usernameChangeHandler}
                    onBlur={usernameBlurHandler}
                  />
                  {usernameHasError && (
                    <small id="username-help" className="p-error block">
                      Câmpul Username este obligatoriu
                    </small>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="password" className="block text-900 font-medium mb-2">
                    Parolă
                  </label>
                  <InputText
                    id="password"
                    type="password"
                    aria-describedby="password-help"
                    className={passwordClasses}
                    value={passwordValue}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                  />
                  {passwordHasError && (
                    <small id="password-help" className="p-error block">
                      Câmpul Parolă este obligatoriu
                    </small>
                  )}
                </div>
                <Button type='submit' label='Înregistrare' icon="pi pi-user" className="w-full" disabled={!formIsValid} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
