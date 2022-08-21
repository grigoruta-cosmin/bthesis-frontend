import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../../store/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import ImageList from "../Images/ImageList";
import ImageViewer from "../Images/ImageViewer";

const AlbumItem = () => {
  const toastRef = useRef();
  const [images, setImages] = useState([]);
  const [listView, setListView] = useState(true);
  const [clickedImageId, setClickedImageId] = useState(-1);
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
        setImages(processedImages);
    });
  }, [authCtx.token, params.albumId])

  const viewClickHandler = (rowData) => {
    console.log(rowData)
    setListView(false);
    setClickedImageId(rowData.id);
    // navigate(`/albums/${params.albumId}/images`, { state: {
    //   rowData: rowData,
    //   photos: photos
    // } })
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
        {
          listView && (
            <ImageList 
              toastRef={toastRef}
              images={images}
              actions={actions}
            />
          )
        }
        {
          !listView && (
            <>
              {/* <Button label="x" onClick={() => setListView(true)}></Button> */}
              <ImageViewer
                images={images}
                onExit={() => setListView(true)}
                clickedImageId={clickedImageId} 
              />
            </>
          )
        }
      </div>
    </div>
  );
};

export default AlbumItem;
