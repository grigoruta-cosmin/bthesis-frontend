import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ImageList = (props) => {
  return (
    <div className="surface-0 mt-4 ml-4 mr-4">
      <div className="card">
        <Toast ref={props.toastRef} />
        <DataTable value={props.images} responsiveLayout="scroll">
          <Column field="fileName" header="Numele Pozei"></Column>
          <Column field="fileExtension" header="Extensia"></Column>
          <Column field="width" header="Lățime"></Column>
          <Column field="height" header="Înălțime"></Column>
          <Column body={props.actions} ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default ImageList;
