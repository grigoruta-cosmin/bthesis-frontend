import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useRef, useState } from "react"
import AuthContext from "../../store/auth-context";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";


const RunList = () => {
  const [runs, setRuns] = useState([]);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const toastRef = useRef();

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
    console.log(rowData)
    navigate(`/runs/${rowData.id}`, { state: rowData })
  };

  const deleteClickHandler = (rowData) => {
    console.log(rowData)
  };

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
          label="Șterge"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => deleteClickHandler(rowData)}
        />
      </span>
    )
  }

  return (
    <>
      <div className="card">
        <Toast ref={toastRef} />
        <DataTable value={runs}>
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