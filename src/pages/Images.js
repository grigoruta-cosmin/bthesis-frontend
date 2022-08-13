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
  const [photos, setPhotos] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(-1);
  console.log("state use location", state);
  const { token } = authCtx;
  const { id } = state;
  const { albumId } = params;
  useEffect(() => {
    fetch(`/album/${albumId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log("aici");
        }
      })
      .then((data) => {
        console.log("asta se intaorce", data);
        const processedImages = data.photos.map((el) => {
          return {
            id: el.id,
            fileName: el.file_name,
            fileExtension: el.file_extension,
            width: el.width,
            height: el.height,
          };
        });
        setPhotos(processedImages);
        console.log(photos);
        const currentPhotoIndex = processedImages.findIndex(
          (el) => (el.id = id)
        );
        setPhotoIndex(currentPhotoIndex);
      });
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

export default Images;
