import { Button } from "primereact/button";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Image from "../components/Images/Image";
import AuthContext from "../store/auth-context";
import ImageControl from "../components/Layout/ImageControl";

const Images = () => {
  const { state } = useLocation();
  const params = useParams();
  const authCtx = useContext(AuthContext);
  // const [photos, setPhotos] = useState([]);
  const [imageIndex, setImageIndex] = useState(-1);
  console.log("state use location", state);
  const images = state.images;
  // const { albumId } = params;
  useEffect(() => {
    setImageIndex(0)
  }, []);

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
  }

  if (imageIndex !== -1) {
    console.log(imageIndex);
    console.log(images[imageIndex].id);
  }
  return (
    <div className="card">
      <div className="grid">
        {/* <div className="flex align-content-center justify-content-center flex-wrap"> */}
        {imageIndex !== -1 && (
          <>
            <div className="col-1 text-center">
            </div>
            <div className="col-10 text-center">
              <ImageControl
                onPrevClick={prevHandler}
                onBackwardClick={backwardHandler}
                onNextClick={nextHandler}
                onForwardClick={forwardHandler}
                onSliderChange={sliderChangeHandler}
                onInputChange={inputChangeHandler}
                max={images.length - 1}
                currentImageIndex={imageIndex}
              />
              {/* <div className="flex justify-content-center"> */}
              <Image imageId={images[imageIndex].id}></Image>
              {/* </div> */}
            </div>
            <div className="col-1 text-center">
            </div>
          </>
        )}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Images;
