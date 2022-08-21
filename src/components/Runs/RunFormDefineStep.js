import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useContext, useEffect, useState, useRef } from "react";
import useInput from "../../hooks/use-input";
import AuthContext from "../../store/auth-context";

const RunFormDefineStep = (props) => {
  const authCtx = useContext(AuthContext);
  const [albums, setAlbums] = useState();
  const toastRef = useRef();
  const {
    value: runNameValue,
    touched: runNameIsTouched,
    isValid: runNameIsValid,
    hasError: runNameHasError,
    valueChangeHandler: runNameChangeHandler,
    inputBlurHandler: runNameBlurHandler,
    reset: resetRunName
  } = useInput((value) => value.trim() !== '', 'TEXT', props.initialSubFormState.runName)

  const {
    value: albumNameValue,
    touched: albumNameIsTouched,
    isValid: albumNameIsValid,
    hasError: albumNameHasError,
    valueChangeHandler: albumNameChangeHandler,
    inputBlurHandler: albumNameBlurHandler,
    reset: resetAlbumName
  } = useInput((value) => !!value, 'NON_TEXT', props.initialSubFormState.albumData);

  
  useEffect(() => {
    fetch('/album', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCtx.token}`
      }
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          toastRef.current.show({severity: 'error', summary: 'Eroare', detail: data.message});
        });
      }
    }).then((data) => {
      const processedAlbums = data.albums.map((el) => {
        return {
          label: el.name,
          value: {
            id: el.id,
            name: el.name
          }
        }
      })
      setAlbums(processedAlbums)
    });
  }, []);
  
  let subFormIsValid = false;
  console.log(runNameIsValid)
  if (runNameIsValid && albumNameIsValid) {
    subFormIsValid = true;
  }

  // const albumName_ChangeHandler = (e) => {
  //   console.log(e)
  // }

  const nextStepHandler = () => {
    if (!subFormIsValid) {
      return;
    }
    props.onNextStep();
    props.onChanges({
      runName: {
        value: runNameValue,
        isTouched: runNameIsTouched
      },
      albumData: {
        value: albumNameValue,
        isTouched: albumNameIsTouched
      }
    });
  };
  
  const albumNameClasses = albumNameHasError ? "p-invalid" : "";
  const runNameClasses = runNameHasError ? "p-invalid w-full mb-3" : "w-full mb-3";
  
  return (
    <>
      <Toast ref={toastRef} />
      <div className="field">
        <label htmlFor="albumName" className="block text-900 font-medium mb-2">Selectează albumul</label>
        { albums && <Dropdown
                     id="albumName"
                     aria-aria-describedby="albumName-help"
                     className={albumNameClasses}
                     value={albumNameValue}
                     options={albums}
                     onChange={albumNameChangeHandler}
                    //  onChange={(e) => console.log(e)}
                     onBlur={albumNameBlurHandler}
                    /> }
        { albumNameHasError && (
          <span id="albumName-help" className="p-error block">
            Selecția unui album este obligatorie
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="runName" className="block text-900 font-medium mb-2">Numele Detecției</label>
        <InputText
          id="runName"
          aria-describedby="runName-help"
          className={runNameClasses}
          value={runNameValue}
          onChange={runNameChangeHandler}
          onBlur={runNameBlurHandler}
        />
        { runNameHasError && (
          <small id="runName-help" className="p-error block">
            Numele Detecției este obligatoriu
          </small>
        )}
      </div>
      <Button label="Pasul următor" onClick={nextStepHandler} disabled={!subFormIsValid}></Button>
    </>
  );
};

export default RunFormDefineStep;