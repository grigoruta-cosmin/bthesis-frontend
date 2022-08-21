import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ImageControl from "../components/Layout/ImageControl";
import AuthContext from "../store/auth-context";
import Image from "../components/Images/Image";

const PredictionViewer = () => {
  const { state } = useLocation();
  const params = useParams();
  // const [photos, setPhotos] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(-1);
  console.log("state use location", state);
  const photos = state.photos;
  // const { albumId } = params;
  useEffect(() => {
    setPhotoIndex(0)
  }, []);

  const sliderChangeHandler = (event) => {
    setPhotoIndex(event.value);
  };

  const backwardHandler = () => {
    setPhotoIndex(0);
  };

  const forwardHandler = () => {
    setPhotoIndex(photos.length - 1);
  };

  const prevHandler = () => {
    if (photoIndex === 0) {
      return;
    }
    setPhotoIndex((prevState) => prevState - 1);
  };

  const nextHandler = () => {
    if (photoIndex === photos.length - 1) {
      return;
    }
    setPhotoIndex((prevState) => prevState + 1);
  };

  const inputChangeHandler = (event) => {
    if (+event.target.value < 0) {
      setPhotoIndex(0);
    } else if (+event.target.value > photos.length - 1) {
      setPhotoIndex(photos.length - 1);
    } else if (Number.isInteger(+event.target.value)){
      setPhotoIndex(+event.target.value)
    } 
  }

  if (photoIndex !== -1) {
    console.log(photoIndex);
    console.log(photos[photoIndex].id);
  }
  return (
    <div className="card">
      <div className="grid">
        {/* <div className="flex align-content-center justify-content-center flex-wrap"> */}
        {photoIndex !== -1 && (
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
                max={photos.length - 1}
                currentPhotoIndex={photoIndex}
              />
              {/* <div className="flex justify-content-center"> */}
              <Image photoId={photos[photoIndex].id}></Image>
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

export default PredictionViewer;