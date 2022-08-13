import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../store/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

const AlbumItem = () => {
  const toastRef = useRef();
  const [photos, setPhotos] = useState([])
  const authCtx = useContext(AuthContext)
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/album/${params.albumId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCtx.token}`
      }
    }).then((res) => {
      if (res.ok) {
        // toastRef.current.show({severity: 'info', summary: 'Succes', detail: })
        return res.json()
      } else {
        return res.json().then((data) => {
          toastRef.current.show({severity: 'error', summary: 'Eroare', detail: data.message})
        });
      }
    }).then((data) => {
        const processedImages = data.photos.map((el) => {
          return {
            id: el.id,
            fileName: el.file_name,
            fileExtension: el.file_extension,
            width: el.width,
            height: el.height
          };
        });
        setPhotos(processedImages);
    });
  }, [authCtx.token, params.albumId])

  const viewClickHandler = (rowData) => {
    console.log(rowData)
    navigate(`/albums/${params.albumId}/images`, { state: rowData})
  };

  const actions = (rowData) => {
    return (
      <Button 
        label="Vizualizează"
        icon="pi pi-eye"
        className="p-button-info"
        onClick={() => viewClickHandler(rowData)}
      />
    );
  };

  return (
    <div className="surface-0 mt-4 ml-4 mr-4">
      <div className="card">
        <Toast ref={toastRef} />
        <DataTable value={photos} responsiveLayout="scroll">
          <Column field="fileName" header="Numele Pozei" sortable></Column>
          <Column field="fileExtension" header="Extensia"></Column>
          <Column field="width" header="Lățime"></Column>
          <Column field="height" header="Înălțime"></Column>
          <Column body={actions} ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default AlbumItem;
