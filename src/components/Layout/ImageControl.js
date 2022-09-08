import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const ImageControl = (props) => {

  const keyDownHandler = (e) => {
    console.log(e);
  }

  return (
    <>
      <div className="card">
        <div className="flex justify-content-center flex-wrap card-container">
          <Button
            className="mr-2"
            onClick={props.onExit}
            icon="pi pi-times"
          />
          <div className="flex align-items-center justify-content-center w-14rem">
            <span className="p-buttonset">
              <Button
                onClick={props.onBackwardClick}
                icon="pi pi-angle-double-left"
                disabled={props.currentImageIndex === 0}
              />
              <Button
                onClick={props.onPrevClick}
                icon="pi pi-angle-left"
                disabled={props.currentImageIndex === 0}
              />
              <Button
                onClick={props.onNextClick}
                icon="pi pi-angle-right"
                disabled={props.currentImageIndex === props.max}
              />
              <Button
                onClick={props.onForwardClick}
                icon="pi pi-angle-double-right"
                disabled={props.currentImageIndex === props.max}
              />
            </span>
          </div>
          <div className="flex align-items-center justify-content-center w-16rem">
            <Slider
              style={{ width: 14 + "rem" }}
              value={props.currentImageIndex}
              min={0}
              max={props.max}
              onChange={props.onSliderChange}
            />
          </div>
          <div className="flex align-items-center justify-content-center w-4rem">
            <InputText
              type="number"
              style={{ width: 4 + "rem" }}
              min={0}
              max={props.max}
              value={props.currentImageIndex}
              onChange={props.onInputChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageControl;
