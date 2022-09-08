import { useState, useEffect } from "react";
import classes from "./Annotation.module.css";

const parseStyleFromString = (style) => {
  return {
    top: Number.parseInt(style.top.replace("px", "")),
    left: Number.parseInt(style.left.replace("px", "")),
    width: Number.parseInt(style.width.replace("px", "")),
    height: Number.parseInt(style.height.replace("px", "")),
  };
};

const parseStyleToString = (unparsedStyle) => {
  return {
    top: `${unparsedStyle.top}px`,
    left: `${unparsedStyle.left}px`,
    width: `${unparsedStyle.width}px`,
    height: `${unparsedStyle.height}px`,
  };
};

const Annotation = (props) => {
  const [showButtons, setShowButtons] = useState(false);
  const [style, setStyle] = useState(props.style);

  const {border} = props.style

  useEffect(() => {
    setStyle((prevState) => {
      return {
        ...prevState,
        border: border
      }
    })
  }, [border]);

  const mouseDownHandler = (mouseDownEvent) => {
    mouseDownEvent.stopPropagation();
    const startSize = parseStyleFromString(style);
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    const onMouseMove = (mouseMoveEvent) => {
      setStyle((prevState) => {
        if (
          startSize.top + mouseMoveEvent.pageY - startPosition.y < 0 ||
          startSize.left + mouseMoveEvent.pageX - startPosition.x < 0
        ) {
          onMouseUp();
          props.onChange({
              id: props.id,
              ...startSize,
              label: props.label

          })
          return {
            ...prevState,
            ...parseStyleToString(startSize),
          };
        }
        if ( 
          startSize.top + mouseMoveEvent.pageY - startPosition.y + startSize.height > props.imageStyle.height ||
          startSize.left + mouseMoveEvent.pageX - startPosition.x + startSize.width > props.imageStyle.width
        ) {
          props.onChange({

              id: props.id,
              ...startSize,
              label: props.label
          })
          onMouseUp();
          return {
            ...prevState,
            ...parseStyleToString(startSize)
          }
        }
        props.onChange({

            id: props.id,
            ...startSize,
            top: startSize.top + mouseMoveEvent.pageY - startPosition.y,
            left: startSize.left + mouseMoveEvent.pageX - startPosition.x,
            label: props.label
          
        })
        return {
          ...prevState,
          ...parseStyleToString({
            top: startSize.top + mouseMoveEvent.pageY - startPosition.y,
            left: startSize.left + mouseMoveEvent.pageX - startPosition.x,
            width: startSize.width,
            height: startSize.height,
          }),
        };
      });
    };

    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    };
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const buttonLeftHandler = (mouseDownEvent) => {
    mouseDownEvent.stopPropagation();
    const startSize = parseStyleFromString(style)
    const startPosition = { w: mouseDownEvent.pageX };
    const onMouseMove = (mouseMoveEvent) => {
      setStyle((prevState) => {
        if (
          startSize.left - startPosition.w + mouseMoveEvent.pageX < 0 
        ) {
          props.onChange({
  
              id: props.id,
              ...startSize,
              label: props.label
            
          })
          return {
            ...prevState,
            ...parseStyleToString(startSize)
          };
        } 
        if (
          - startPosition.w + mouseMoveEvent.pageX > startSize.width
        ) {
          props.onChange({

              id: props.id,
              ...startSize,
              label: props.label
            
          })
          return {
            ...prevState,
            ...parseStyleToString(startSize)
          };
        }
        props.onChange({

            id: props.id,
            ...startSize,
            width: startSize.width + startPosition.w - mouseMoveEvent.pageX,
            left: startSize.left - startPosition.w + mouseMoveEvent.pageX,
            label: props.label
          
        })
        return {
          ...prevState,
          ...parseStyleToString({
            top: startSize.top,
            height: startSize.height,
            width: startSize.width + startPosition.w - mouseMoveEvent.pageX,
            left: startSize.left - startPosition.w + mouseMoveEvent.pageX
          })
        };
      });
    };
    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    }
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const buttonRightHandler = (mouseDownEvent) => {
    mouseDownEvent.stopPropagation();
    const startSize = parseStyleFromString(style);
    const startPosition = { w: mouseDownEvent.pageX };
    const onMouseMove = (mouseMoveEvent) => {
      setStyle((prevState) => {
        if (
          startSize.left + startSize.width - startPosition.w + mouseMoveEvent.pageX > props.imageStyle.width
          ) {
            props.onChange({

                id: props.id,
                ...startSize,
                label: props.label
              
            })
            return {
              ...prevState,
              ...parseStyleToString(startSize)
            };
          }
        if (
          startSize.width - startPosition.w + mouseMoveEvent.pageX < 0 
          ) {
            props.onChange({

                id: props.id,
                ...startSize,
                label: props.label
              
            })
            return {
              ...prevState,
              ...parseStyleToString(startSize)
            }
          }
        props.onChange({

            id: props.id,
            ...startSize,
            width: startSize.width - startPosition.w + mouseMoveEvent.pageX,
            label: props.label
          
        })
        return {
          ...prevState,
          ...parseStyleToString({
            width: startSize.width - startPosition.w + mouseMoveEvent.pageX,
            top: startSize.top,
            left: startSize.left,
            height: startSize.height
          })
        };
      });
    };
    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    }
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const buttonDownHandler = (mouseDownEvent) => {
    mouseDownEvent.stopPropagation();
    const startSize = parseStyleFromString(style)
    const startPosition = { h: mouseDownEvent.pageY };
    const onMouseMove = (mouseMoveEvent) => {
      setStyle((prevState) => {
        if (
          startSize.top + startSize.height - startPosition.h + mouseMoveEvent.pageY > props.imageStyle.height - 3
        ) {
          props.onChange({

              id: props.id,
              ...startSize,
              label: props.label
            
          })
          return {
            ...prevState,
            ...parseStyleToString(startSize)
          }
        }
        if (
          startSize.height - startPosition.h + mouseMoveEvent.pageY < 0
        ) {
          props.onChange({

              id: props.id,
              ...startSize,
              label: props.label
            
          })
          return {
            ...prevState,
            ...parseStyleToString(startSize)
          }
        }
        props.onChange({

            id: props.id,
            ...startSize,
            height: startSize.height - startPosition.h + mouseMoveEvent.pageY,
            label: props.label
          
        })
        return {
          ...prevState,
          ...parseStyleToString({
            height: startSize.height - startPosition.h + mouseMoveEvent.pageY,
            top: startSize.top,
            left: startSize.left,
            width: startSize.width
          })
        };
      });
    }
    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    }
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const buttonUpHandler = (mouseDownEvent) => {
    mouseDownEvent.stopPropagation();
    const startSize = parseStyleFromString(style)
    const startPosition = { h: mouseDownEvent.pageY };
    const onMouseMove = (mouseMoveEvent) => {
        setStyle((prevState) => {
          if (
            startSize.top - startPosition.h + mouseMoveEvent.pageY < 0
          ) {
            props.onChange({

                id: props.id,
                ...startSize,
                label: props.label
              
            })
            return {
              ...prevState,
              ...parseStyleToString(startSize)
            }
          }
          if (
            - startPosition.h + mouseMoveEvent.pageY > startSize.height
          ) {
            props.onChange({

                id: props.id,
                ...startSize,
                label: props.label
            })
            return {
              ...prevState,
              ...parseStyleToString(startSize)
            }
          }
          props.onChange({
              id: props.id,
              ...startSize,
              height: startSize.height + startPosition.h - mouseMoveEvent.pageY,
              top: startSize.top - startPosition.h + mouseMoveEvent.pageY,
              label: props.label
          })
          return {
            ...prevState,
            ...parseStyleToString({
              height: startSize.height + startPosition.h - mouseMoveEvent.pageY,
              top: startSize.top - startPosition.h + mouseMoveEvent.pageY,
              left: startSize.left,
              width: startSize.width
            })
          };
        });
    }
    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
    }
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  return (
    <div
      onMouseDown={mouseDownHandler}
      style={style}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      {showButtons && (
        <>
          <button
            id={classes.ns}
            onMouseDown={buttonUpHandler}
            style={{
              position: "absolute",
              top: "-3px",
              left: `${
                Number.parseFloat(style.width.replace("px", "")) / 2 - 10
              }px`,
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              textDecoration: "none",
              border: "1px solid",
            }}
          ></button>
          <button
            id={classes.ns}
            onMouseDown={buttonDownHandler}
            style={{
              position: "absolute",
              top: `${Number.parseInt(style.height.replace("px", "")) - 5}px`,
              left: `${
                Number.parseInt(style.width.replace("px", "")) / 2 - 10
              }px`,
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              textDecoration: "none",
              border: "1px solid",
              margin: "0px",
            }}
          ></button>
          <button
            id={classes.ew}
            onMouseDown={buttonLeftHandler}
            style={{
              position: "absolute",
              top: `${
                Number.parseInt(style.height.replace("px", "")) / 2 - 5
              }px`,
              left: `${0 - 8}px`,
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              textDecoration: "none",
              border: "1px solid",
            }}
          ></button>
          <button
            id={classes.ew}
            onMouseDown={buttonRightHandler}
            style={{
              position: "absolute",
              top: `${
                Number.parseInt(style.height.replace("px", "")) / 2 - 5
              }px`,
              left: `${
                Number.parseFloat(style.width.replace("px", "")) - 10
              }px`,
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              textDecoration: "none",
              border: "1px solid",
            }}
          ></button>
        </>
      )}
      {/* <button style={{position: 'absolute', top: '0', left: '0'}}>x</button>
      <button style={{position: 'absolute', top: '0', left: '0'}}>x</button>
      <button style={{position: 'absolute', top: '0', left: '0'}}>x</button>
      <button style={{position: 'absolute', top: '0', left: '0'}}>x</button>
      <button style={{position: 'absolute', top: '0', left: '0'}}>x</button>
      <button style={{position: 'absolute', top: '0', left: '0'}}>x</button>
      <button style={{position: 'absolute', top: '0', left: '0'}}>x</button> */}
    </div>
  );
};

export default Annotation;
