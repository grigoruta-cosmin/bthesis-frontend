import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import { useParams } from "react-router-dom";

const AlbumItem = () => {
  const [photos, setPhotos] = useState([])
  const authCtx = useContext(AuthContext)
  const params = useParams();
  
  useEffect(() => {
    fetch(`/album/${params.albumId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCtx.token}`
      }
    })
  }, [])

  return (
    <div className="card">
      {console.log(params)}
      {/* <DataTable>
        <Column>
        </Column>
      </DataTable> */}
    </div>
  );
};

export default AlbumItem;
