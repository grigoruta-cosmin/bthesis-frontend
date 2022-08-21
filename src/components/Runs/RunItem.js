import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import ImageList from "../Images/ImageList";
import { Button } from "primereact/button";
import { useRef } from "react";
import ImageViewer from "../Images/ImageViewer";
import PredictionViewer from "../Predictions/PredictionViewer";

const RunItem = () => {
  const toastRef = useRef();
  const [runState, setRunState] = useState([]);
  const [listView, setListView] = useState(true);
  const [clickedImageId, setClickedImageId] = useState(-1);
  const authCtx = useContext(AuthContext);
  const params = useParams();

  useEffect(() => {
    fetch(`/run/${params.runId}`, {
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
        const _runState = {
          id: data.id,
          name: data.name,
          type: data.type,
          confidenceThreshold: data.confidence_treshold,
          albumId: data.album_id,
          creationDatetime: data.creation_datetime,
          images: data.images.map((el) => {
            return {
              id: el.id,
              fileName: el.file_name,
              fileExtension: el.file_extension,
              width: el.width,
              height: el.height
            };
          })
        }
        setRunState(_runState);
    });
  }, [authCtx.token, runState.albumId])

  const viewClickHandler = (rowData) => {
    console.log(rowData)
    setListView(false);
    setClickedImageId(rowData.id);
    // navigate(`/runs/${params.runId}/images`, { state: {
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
              images={runState.images}
              actions={actions}
            />
          )
        }
        {
          !listView && (
            <>
              {/* <Button label="x" onClick={() => setListView(true)}></Button> */}
              <PredictionViewer
                images={runState.images}
                onExit={() => setListView(true)}
                clickedImageId={clickedImageId} 
                runId={runState.id}
              />
            </>
          )
        }
      </div>
    </div>
  );
};

export default RunItem;