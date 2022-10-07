import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useRef, useState } from "react"
import AuthContext from "../../store/auth-context";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog"
import { useNavigate } from "react-router-dom";
import useInput from "../../hooks/use-input";
import { InputText } from "primereact/inputtext";
import { saveAs } from "file-saver";


const isNotEmpty = (value) => value.trim() !== '';

const RunList = () => {
  const [runs, setRuns] = useState([]);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const toastRef = useRef();
  const [dialogIsVisible, setDialogIsVisible] = useState(false);
  const [clickedRowData, setClickedRowData] = useState(null)
  const {
    value: exportNameValue,
    isValid: exportNameIsValid,
    hasError: exportNameHasError,
    valueChangeHandler: exportNameChangeHandler,
    inputBlurHandler: exportNameBlurHandler,
    reset: resetExportName
  } = useInput(isNotEmpty)

  useEffect(() => {
    fetch('/run', {
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
          toastRef.current.show({severity: 'error', summary: 'Eroare', details: 'Eroare la încărcarea detecțiilor'});
        });
      }
    }).then((data) => {
      const processedRuns = data.runs.map((el) => {
        const time = new Date(el.creation_datetime)
        return {
          id: el.id,
          name: el.name,
          type: el.type,
          confidenceThreshold: el.confidence_threshold,
          creationDatetime: `${time.toLocaleDateString('ro-RO', {year: 'numeric', month: 'long', day: 'numeric'})}, ${time.toLocaleTimeString('ro-RO')}`,
          albumName: el.album_name,
          albumId: el.album_id
        }
      });
      setRuns(processedRuns)
    });
  }, []);

  const viewClickHandler = (rowData) => {
    // console.log(rowData)
    navigate(`/runs/${rowData.id}`)
  };

  const deleteClickHandler = (rowData) => {
    console.log(rowData)
    fetch(`/run/${rowData.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCtx.token}`
      }
    }).then((res) => {
      if (res.ok) {
        toastRef.current.show({severity: 'info', summary: 'Succes', detail: 'Detecția a fost ștearsă cu succes'})
        return res.json()
      } else {
        return res.json().then((data) => {
          toastRef.current.show({severity: 'error', summary: 'Eroare', detail: data.msg})
        });
      }
    }).then((data) => {
      let _runs = runs.filter(el => el.id !== data.id);
      setRuns(_runs);
    })
  };

  const displayModalButtonClickHandler = (rowData) => {
    setClickedRowData(rowData);
    console.log("intru aici")
    setDialogIsVisible(true);
  }

  const exportClickHandler = () => {
    fetch('/download?' + new URLSearchParams({
      run_id: clickedRowData.id,
      filename: exportNameValue
    }), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authCtx.token}`
      }
    }).then((res) => {
      if (res.ok) {
        return res.blob()
      }
    }).then((data) => {
      saveAs(URL.createObjectURL(data), exportNameValue)
    })
  }

  const footer = (
    <div>
      <Button label="Anulează" icon="pi pi-times" onClick={() => setDialogIsVisible(false)}></Button>
      <Button label="Descarcă" icon="pi pi-check" disabled={!exportNameIsValid} onClick={exportClickHandler}></Button>
    </div>
  );

  const actions = (rowData) => {
    return (
      <span className="p-buttonset">
        <Button
          label="Vizualizează"
          icon="pi pi-eye"
          className="p-button-info"
          onClick={() => viewClickHandler(rowData)}
        />
        <Button
          label="Exportă"
          icon="pi pi-download"
          className="p-button-success"
          onClick={() => displayModalButtonClickHandler(rowData)}
        />
        <Button
          label="Șterge"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => deleteClickHandler(rowData)}
        />
      </span>
    )
  }

  const header = () => {
    let headerElem;
    if (!!clickedRowData) {
      headerElem = <span>Exportă {clickedRowData.name}</span>
    } else {
      headerElem = <span>Exportă</span>
    }
    return (
      headerElem
    );
  }

  const exportNameClasses = exportNameHasError ? 'p-invalid w-full mb-3' : 'w-full mb-3';

  return (
    <>
      <div className="card">
        <Toast ref={toastRef} />
        <Dialog header={() => header()} visible={dialogIsVisible} style={{ width: '35vw' }} footer={footer} modal onHide={() => setDialogIsVisible(false)}>
            <p>Exportați adnotările dumneavostră. Veți descărca o arhiva .zip în care acestea vor fi disponibile în formatul YOLO.</p>
            <div className="field">
              <label htmlFor="exportName" className="block text-900 font-medium mb-2">Numele arhivei</label>
              <InputText 
                id="exportName"
                aria-describedby="exportName-help"
                className={exportNameClasses}
                value={exportNameValue}
                onChange={exportNameChangeHandler}
                onBlur={exportNameBlurHandler}
              />
              {exportNameHasError && <small id='username-help' className='p-error block' >Numele arhivei este obligatoriu</small>}
            </div>
        </Dialog>
        <DataTable value={runs} emptyMessage="Nu aveți nicio detecție creată.">
          <Column field="name" header="Numele" sortable></Column>
          <Column field="type" header="Modelul" ></Column>
          <Column field="confidenceThreshold" header="Pragul de Încredere"></Column>
          <Column field="creationDatetime" header="Data creării"></Column>
          <Column field="albumName" header="Albumul folosit" sortable></Column>
          <Column body={actions}></Column>
        </DataTable>
      </div>
    </>
  );
};

export default RunList;