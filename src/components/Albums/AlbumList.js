import { useContext, useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column"
import { Button } from "primereact/button";
import AuthContext from "../../store/auth-context";
import AlbumItem from "./AlbumItem";
import { useNavigate } from "react-router-dom";

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const authCtx = useContext(AuthContext);
  const toastRef = useRef();
  const navigate = useNavigate();

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
        const time = new Date(el.creation_datetime)
        return {
          id: el.id,
          name: el.name,
          numberOfPhotos: 1000,
          creationDatetime: `${time.toLocaleDateString('ro-RO', {year: 'numeric', month: 'long', day: 'numeric'})}, ${time.toLocaleTimeString('ro-RO')}`
        }
      })
      setAlbums(processedAlbums)      
    });
  }, []);

  const viewClickHandler = (rowData) => {
    navigate(`/albums/${rowData.id}`);
  };

  const deleteClickHandler = (rowData) => {
    console.log(rowData);
    fetch(`/album/${rowData.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCtx.token}`
      }
    }).then((res) => {
      if (res.ok) {
        toastRef.current.show({severity: 'info', summary: 'Succes', detail: 'Albumul a fost sters cu succes'})
        return res.json()
      } else {
        return res.json().then((data) => {
          toastRef.current.show({severity: 'error', summary: 'Eroare', detail: 'Eroare la ștergerea albumului'})
        })
      }
    }).then((data) => {
      let _albums = albums.filter(el => el.id !== rowData.id);
      setAlbums(_albums);
    });
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
    );
  };

  return (
    <>
      <div className="card">
        <Toast ref={toastRef} />
        <DataTable value={albums} responsiveLayout="scroll">
          <Column field="name" header="Numele" sortable></Column>
          <Column field="numberOfPhotos" header="Numărul de Poze" sortable></Column>
          <Column field="creationDatetime" header="Data creării" sortable></Column>
          <Column body={actions} ></Column>
        </DataTable>
      </div>
    </>
  );
};

export default AlbumList;
