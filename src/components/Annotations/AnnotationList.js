import { Button } from "primereact/button";
import AnnotationItem from "./AnnotationItem";

import classes from "./AnnotationList.module.css";

const AnnotationList = (props) => {
  return (
    <div className={classes.nostyle + ' mt-3'}>
      <div className="flex justify-content-between flex-wrap card-container purple-container">
        <div className="flex align-items-center justify-content-center">
          <p className="text-900 text-3xl font-medium">Lista adnotărilor</p>
        </div>
        <div className="flex align-items-center justify-content-center">
          <Button onClick={props.onNewAnnotationClick} icon="pi pi-plus align-items-center" className="p-button-sm"></Button>
          <Button onClick={props.onSaveChangesClick} icon="pi pi-save" className="p-button-sm" />
        </div>
      </div>
      {/* <Button icon="pi pi-plus" className="p-button"></Button> */}
      <ul className="overflow-scroll" style={{height: '450px'}}>
        {
          props.values.map((value) => {
            return <AnnotationItem
                    key={value.id}
                    id={value.id}
                    top={value.top}
                    left={value.left}
                    width={value.width}
                    height={value.height}
                    label={value.label}
                    onDeleteAnnotationClick={props.onDeleteAnnotationClick}   
                    onChangeAnnotation={props.onChangeAnnotation}
                  />
          })
        }
      </ul>
    </div>
  );
};

export default AnnotationList;