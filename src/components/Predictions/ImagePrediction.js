import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import classes from "./ImagePrediction.module.css";

const ImagePrediction = (props) => {
  const [predictions, setPredictions] = useState([]);
  const [multiplier, setMultiplier] = useState();
  const bboxAnnotatorRef = useRef();
  const [bboxAnnotatorStyle, setBboxAnnotatorStyle] = useState();
  const [imageFrameStyle, setImageFrameStyle] = useState();
  const [image, setImage] = useState();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    console.log("MA APELE IMAGE BLOB");
    // const _idx = images.findIndex((el) => el.id === props.image.imageIndex)
    // setImageIndex(_idx);
    fetch(`/image/${props.image.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authCtx.token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.blob();
        } else {
        }
      })
      .then((data) => {
        const imageObject = URL.createObjectURL(data);
        setImage(imageObject);
      });
  }, [props.image.id]);

  useEffect(() => {
    fetch(
      "/prediction?" +
        new URLSearchParams({
          run_id: props.runId,
          image_id: props.image.id,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
        }
      })
      .then((data) => {
        console.log(data);
        setPredictions(
          data.predictions.map((pred) => {
            console.log("props.image", props.image);
            return {
              id: pred.id,
              left:
                pred.center_x * props.image.width -
                (pred.width * props.image.width) / 2,
              top:
                pred.center_y * props.image.height -
                (pred.height * props.image.height) / 2,
              width: pred.width * props.image.width,
              height: pred.height * props.image.height,
              label: pred.label,
              confidenceScore: pred.confidenceScore,
            };
          })
        );
      });
  }, [props.runId, props.image.id]);

  useEffect(() => {
    const maxWidth = bboxAnnotatorRef.current?.offsetWidth || 1;
    const imageElement = new Image();
    imageElement.src = image;
    imageElement.onload = () => {
      const width = imageElement.width;
      const height = imageElement.height;

      setMultiplier(width * maxWidth);
      setBboxAnnotatorStyle({
        width: width,
        height: height,
      });
      setImageFrameStyle({
        backgroundImageSrc: imageElement.src,
        width: width,
        height: height,
      });
    };
  }, [image, multiplier, bboxAnnotatorRef]);

  // const rectangle = (centerX, centerY, _width, _height, imageWidth, imageHeight) => {
  //   const x1 = centerX * imageWidth - width * imageWidth / 2;
  //   const y1 = centerY * imageHeight - height * imageHeight / 2;
  //   const width = _width * imageWidth;
  //   const height = _height * imageHeight;
  //   return {
  //     x1: x1,
  //     y1: y1,
  //     width: width,
  //     height: height
  //   };
  // };

  return (
    <>
      {!!predictions && !!bboxAnnotatorStyle && !!imageFrameStyle && (
        <>
        <div className="mt-4 flex justify-content-center flex-wrap card-container">
          <div className="card" style={{marginRight: "auto", visibility: "hidden"}}>
            <DataTable value={predictions} responsiveLayout="scroll">
              <Column field="left" header="X"></Column>
              <Column field="top" header="Y"></Column>
              <Column field="width" header="Lățime"></Column>
              <Column field="height" header="Înălțime"></Column>
              <Column field="label" header="Clasă"></Column>
            </DataTable>
          </div>
          <TransformWrapper>
            <TransformComponent>
              <div
                className={classes.bboxAnnotator}
                style={{
                  width: `${bboxAnnotatorStyle.width}px`,
                  height: `${bboxAnnotatorStyle.height}px`,
                }}
                ref={bboxAnnotatorRef}
              >
                <div
                  className={classes.imageFrame}
                  style={{
                    width: `${imageFrameStyle.width}px`,
                    height: `${imageFrameStyle.height}px`,
                    backgroundImage: `url(${imageFrameStyle.backgroundImageSrc})`,
                  }}
                >
                  {predictions.map((prediction, i) => {
                    let borderStyle;
                    if (prediction.label === 0) {
                      borderStyle = `${2}px solid rgb(255,0,0)`
                    } else if (prediction.label === 1) {
                      borderStyle = `${2}px solid rgb(0,255,0)`
                    } else if (prediction.label === 2) {
                      borderStyle = `${2}px solid rgb(0,0,255)`
                    }
                    console.log(prediction.label,{
                      border: borderStyle,
                      position: "absolute",
                      top: `${Math.round(prediction.top)}px`,
                      left: `${Math.round(prediction.left)}px`,
                      width: `${Math.round(prediction.width)}px`,
                      height: `${Math.round(prediction.height)}px`,
                      color: "rgb(255,0,0)",
                    });
                    return (
                      <div
                        style={{
                          border: borderStyle,
                          position: "absolute",
                          top: `${Math.round(prediction.top)}px`,
                          left: `${Math.round(prediction.left)}px`,
                          width: `${Math.round(prediction.width)}px`,
                          height: `${Math.round(prediction.height)}px`,
                          color: "rgb(255,0,0)",
                        }}
                        key={i}
                      >
                        <div style={{ overflow: "hidden" }}>
                          {prediction.label} {prediction.confidenceScore}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TransformComponent>
          </TransformWrapper>
          <div className="card" style={{marginLeft: "auto"}}>
            <DataTable value={predictions} responsiveLayout="scroll">
              <Column field="left" header="X"></Column>
              <Column field="top" header="Y"></Column>
              <Column field="width" header="Lățime"></Column>
              <Column field="height" header="Înălțime"></Column>
              <Column field="label" header="Clasă"></Column>
            </DataTable>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default ImagePrediction;
