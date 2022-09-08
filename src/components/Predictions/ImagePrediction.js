import { useContext, useEffect, useReducer, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import classes from "./ImagePrediction.module.css";
import Annotation from "./Annotation";
import AnnotationList from "../Annotations/AnnotationList";


const reducer = (state, action) => {
  if (action.type === "LOAD") {
    return {
      loaded: [...action.value],
      updated: [],
      removed: [],
      new: []
    };
  } else if (action.type === "UPDATE") {
    const foundInNew = state.new.findIndex((el) => el.id === action.value.id);
    if (foundInNew !== -1) {
      const newNew = state.new.map((el) => {
        if (el.id === action.value.id) {
          return {
            ...el,
            ...action.value
          }
        }
        return el;
      })
      return {
        loaded: [...state.loaded],
        updated: [...state.updated],
        new: [...newNew],
        removed: [...state.removed]
      }
    } else {
      const newLoaded = state.loaded.filter((el) => el.id !== action.value.id);
      const foundInUpdated = state.updated.findIndex((el) => el.id === action.value.id);
      if (foundInUpdated !== -1) {
        const newUpdated = state.updated.map((el) => {
          if (el.id === action.value.id) {
            return {
              ...el,
              ...action.value
            }
          }
          return el
        });
        return {
          loaded: [...newLoaded],
          updated: [...newUpdated],
          new: [...state.new],
          removed: [...state.removed]
        };
      } else {
        return {
          loaded: [...newLoaded],
          updated: [...state.updated, action.value],
          new: [...state.new],
          removed: [...state.removed]
        };
      }
    }
  } else if (action.type === "DELETE") {
    const foundInNew = state.new.findIndex((el) => el.id === action.value.id);
    if (foundInNew !== -1) {
      const newNew = state.new.filter((el) => el.id !== action.value.id);
      return {
        ...state,
        new: [...newNew]
      }
    }
    // console.log('DEBUG', stat)
    const newLoaded = state.loaded.filter((el) => el.id !== action.value.id);
    const newUpdated = state.updated.filter((el) => el.id !== action.value.id);
    return {
      loaded: [...newLoaded],
      updated: [...newUpdated],
      new: [...state.new],
      removed: [...state.removed, action.value]
    };
  } else if (action.type === "NEW") {
    return {
      ...state,
      new: [...state.new, action.value]
    };
  }
};

const concatArraysFromObject = (obj) => {
  return [...obj.new, ...obj.updated, ...obj.loaded]
}

const ImagePrediction = (props) => {
  const [predictions, dispatch] = useReducer(reducer, {
    loaded: [],
    updated: [],
    new: [],
    removed: []
  });
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
    fetch(`/file/${props.image.id}`, {
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
  }, [props.image.id, authCtx.token]);

  useEffect(() => {
    fetch(
      "/annotation?" +
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
        // setPredictions(
        //   data.predictions.map((pred) => {
        //     console.log("props.image", props.image);
        //     return {
        //       id: pred.id,
        //       left:
        //         pred.center_x * props.image.width -
        //         (pred.width * props.image.width) / 2,
        //       top:
        //         pred.center_y * props.image.height -
        //         (pred.height * props.image.height) / 2,
        //       width: pred.width * props.image.width,
        //       height: pred.height * props.image.height,
        //       label: pred.label,
        //       confidenceScore: pred.confidenceScore,
        //     };
        //   })
        // );
        const processedPredictions = data.annotations.map((pred) => {
          console.log("props.image", props.image);
          return {
            id: pred.id,
            xCenter: pred.center_x,
            yCenter: pred.center_y,
            width: pred.width,
            height: pred.height,
            label: pred.label,
          };
        });
        dispatch({ type: "LOAD", value: processedPredictions });
      });
  }, [props.image, authCtx.token]);

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

  const convertToAbsoluteValues = (predictions) => {
    return predictions.map((pred) => {
      return {
        ...pred,
        top:
          pred.xCenter * imageFrameStyle.width -
          (pred.width * imageFrameStyle.width) / 2,
        left:
          pred.yCenter * imageFrameStyle.height -
          (pred.height * imageFrameStyle.height) / 2,
        width: pred.width * imageFrameStyle.width,
        height: pred.height * imageFrameStyle.height,
      };
    });
  };

  const changeAnnotationHandler = (value) => {
    dispatch({
      type: "UPDATE",
      value: {
        id: value.id,
        xCenter:
          (value.left + value.width / 2) /
          imageFrameStyle.height,
        yCenter:
          (value.top + value.height / 2) /
          imageFrameStyle.width,
        width: value.width / imageFrameStyle.width,
        height: value.height / imageFrameStyle.height,
        label: value.label,
      }
    })
  };

  const deleteAnnotationClickHandler = (value) => {
    dispatch({
      type: 'DELETE',
      value: {
        id: value.id,
        xCenter:
          (value.left + value.width / 2) /
          imageFrameStyle.height,
        yCenter:
          (value.top + value.height / 2) /
          imageFrameStyle.width,
        width: value.width / imageFrameStyle.width,
        height: value.height / imageFrameStyle.height,
        label: value.label,
      }
    })
  }

  const newAnnotationClickHandler = () => {
    dispatch({
      type: 'NEW',
      value: {
        id: new Date().valueOf(),
        xCenter: 0.2,
        yCenter: 0.2,
        width: 0.2,
        height: 0.2,
        label: 0,
      }
    })
  }

  const saveChangesClickHandler = () => {
    console.log(JSON.stringify({
      new: [1, 2, 3, 4],
      updated: [5, 6, 7, 8],
      removed: [9, 10, 11, 12]
    }))
    fetch('/update', {
      method: 'POST',
      body: JSON.stringify({
        new: predictions.new,
        updated: predictions.updated,
        removed: predictions.removed,
        run_id: props.runId,
        image_id: props.image.id
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authCtx.token}`
      }
    }).then((res) => {
      if (res.ok) {
        return res.json()
      } else {

      }
    }).then((data) => {
      console.log(data)
    })
  }

  return (
    <>
      {!!predictions && !!bboxAnnotatorStyle && !!imageFrameStyle && (
        <>
          <div className="grid">
            <div className="col-2"></div>
            <div className="col-6 align-content-center mt-4 align-content-center">
              <div
                className={`${classes.bboxAnnotator} align-content-center`}
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
                  {concatArraysFromObject(predictions).map((prediction, i) => {
                    let borderStyle;
                    console.log('pred.label', prediction.label);
                    if (prediction.label === 0) {
                      borderStyle = `${2}px solid rgb(255,0,0)`;
                    } else if (prediction.label === 1) {
                      console.log('INTRU AICI');
                      borderStyle = `${2}px solid rgb(0,255,0)`;
                    } else if (prediction.label === 2) {
                      borderStyle = `${2}px solid rgb(0,0,255)`;
                    }
                    const top =
                      prediction.yCenter * imageFrameStyle.height -
                      (prediction.height * imageFrameStyle.height) / 2;
                    const left =
                      prediction.xCenter * imageFrameStyle.width -
                      (prediction.width * imageFrameStyle.width) / 2;
                    const width = prediction.width * imageFrameStyle.width;
                    const height = prediction.height * imageFrameStyle.height;
                    // console.log(prediction.label, {
                    //   border: borderStyle,
                    //   position: "absolute",
                    //   top: `${Math.round(top)}px`,
                    //   left: `${Math.round(left)}px`,
                    //   width: `${Math.round(width)}px`,
                    //   height: `${Math.round(height)}px`,
                    //   color: "rgb(255,0,0)",
                    // });
                    return (
                      <Annotation
                        style={{
                          border: borderStyle,
                          position: "absolute",
                          top: `${Math.round(top)}px`,
                          left: `${Math.round(left)}px`,
                          width: `${Math.round(width)}px`,
                          height: `${Math.round(height)}px`,
                          color: "rgb(255,0,0)",
                        }}
                        onChange={changeAnnotationHandler}
                        key={prediction.id}
                        id={prediction.id}
                        imageStyle={imageFrameStyle}
                        label={prediction.label}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card">
                <AnnotationList
                  onSaveChangesClick={saveChangesClickHandler}
                  onChangeAnnotation={changeAnnotationHandler}
                  onDeleteAnnotationClick={deleteAnnotationClickHandler}
                  onNewAnnotationClick={newAnnotationClickHandler}
                  values={convertToAbsoluteValues(concatArraysFromObject(predictions))} 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ImagePrediction;
