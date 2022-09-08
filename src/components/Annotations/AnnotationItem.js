import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';

const items = [
  {
    label: 'Mașină',
    value: 0,
  },
  {
    label: 'Semafor',
    value: 1
  },
  {
    label: 'Pieton',
    value: 2
  }
]

const AnnotationItem = (props) => {
  const [label, setLabel] = useState(props.label); 
  
  let cardBackgroundColor;
  if (label === 0) {
    cardBackgroundColor = 'rgb(255,0,0,0.3)';
  } else if (label === 1) {
    cardBackgroundColor = 'rgb(0,255,0,0.3)';
  } else if (label === 2) {
    cardBackgroundColor = 'rgb(0,0,255,0.3)';
  }

  const changeAnnotationClickHandler = (e) => {
    setLabel(e.value);
    props.onChangeAnnotation({
      id: props.id,
      top: props.top,
      left: props.left,
      width: props.width,
      height: props.height,
      label: e.value
    });
  }

  const deleteAnnotationClickHandler = () => {
    props.onDeleteAnnotationClick({
      id: props.id,
      top: props.top,
      left: props.left,
      width: props.width,
      height: props.height,
      label: props.label
    });
  }

  return (
    <li>
      <Card style={{height: '100px', backgroundColor: cardBackgroundColor}}>
        <div className="flex justify-content-between flex-wrap card-container">
          <div className="flex align-items-center justify-content-center">
            <span className="text-900 text-sm line-height-3">
              x: {props.top}px &nbsp; y: {props.left}px &nbsp;&nbsp;
              w: {props.width}px &nbsp; h: {props.height}px
            </span>
          </div>
          <div className="flex align-items-center justify-content-center">
            <Dropdown style={{width: '135px'}} value={label} onChange={changeAnnotationClickHandler} options={items}></Dropdown>
            <Button onClick={deleteAnnotationClickHandler} className='ml-2' icon='pi pi-times'></Button>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default AnnotationItem;