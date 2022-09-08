import { useContext, useEffect, useState } from "react";
import ImageControl from "../Layout/ImageControl";
import Image from "../Images/Image";
import PredictionList from "./PredictionList";
import BBoxAnnotator from "react-bbox-annotator";
import AuthContext from "../../store/auth-context";
import PredictionSelect from "./PredictionSelect";
import ImagePrediction from "./ImagePrediction";

const PredictionViewer = (props) => {
  const images = props.images;
  const authCtx = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [imageIndex, setImageIndex] = useState(-1);

  useEffect(() => {
    console.log("MA APELE IMAGE BLOB");
    const _idx = images.findIndex((el) => el.id === props.clickedImageId);
    setImageIndex(_idx);
  }, [props.clickedImageId]);

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
    } else if (Number.isInteger(+event.target.value)) {
      setImageIndex(+event.target.value);
    }
  };

  

  return (
    <>
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
            {/* <div className="mt-4 flex justify-content-center flex-wrap card-container">
                  <Image imageId={images[imageIndex].id}></Image>
                </div>
                <PredictionList
                  imageId={images[imageIndex].id}
                  runId={props.runId}
                /> */}
            <ImagePrediction
              runId={props.runId}
              image={{ ...images[imageIndex] }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default PredictionViewer;
