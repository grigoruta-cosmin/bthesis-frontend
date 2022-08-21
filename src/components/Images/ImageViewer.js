import { useEffect, useState } from "react";
import ImageControl from "../Layout/ImageControl";
import Image from "./Image";

const ImageViewer = (props) => {
  const images = props.images;
  const [imageIndex, setImageIndex] = useState(-1);

  useEffect(() => {
    const _idx = images.findIndex((el) => el.id === props.clickedImageId)
    setImageIndex(_idx);
  }, [])

  const sliderChangeHandler = (event) => {
    setImageIndex(event.value);
  };

  const backwardHandler = () => {
    setImageIndex(0);
  };

  const forwardHandler = () => {
    setImageIndex(images.length - 1);
  };

  const prevHandler = () => {
    if (imageIndex === 0) {
      return;
    }
    setImageIndex((prevState) => prevState - 1);
  };

  const nextHandler = () => {
    if (imageIndex === images.length - 1) {
      return;
    }
    setImageIndex((prevState) => prevState + 1);
  };

  const inputChangeHandler = (event) => {
    if (+event.target.value < 0) {
      setImageIndex(0);
    } else if (+event.target.value > images.length - 1) {
      setImageIndex(images.length - 1);
    } else if (Number.isInteger(+event.target.value)){
      setImageIndex(+event.target.value)
    } 
  };

  return (
    <div className="card">
        {imageIndex !== -1 && (
          <>
              <ImageControl
                onPrevClick={prevHandler}
                onBackwardClick={backwardHandler}
                onNextClick={nextHandler}
                onForwardClick={forwardHandler}
                onSliderChange={sliderChangeHandler}
                onInputChange={inputChangeHandler}
                onExit={props.onExit}
                max={images.length - 1}
                currentImageIndex={imageIndex}
              />
              <div className="mt-4 flex justify-content-center flex-wrap card-container">
                <Image imageId={images[imageIndex].id}></Image>
              </div>
          </>
        )}
    </div>
  );
}

export default ImageViewer;