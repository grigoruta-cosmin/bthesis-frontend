import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";

const PredictionList = (props) => {
  const [predictions, setPredictions] = useState();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    fetch('/annotation?' + new URLSearchParams({
      run_id: props.runId,
      image_id: props.imageId      
    }),{
      method: 'GET',
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
      setPredictions(data.predictions.map((pred) => {
        return {
          id: pred.id,
          centerX: pred.center_x,
          centerY: pred.center_y,
          width: pred.width,
          height: pred.height,
          label: pred.label,
        };
      }))
    })
  }, [props.runId, props.imageId])

  return (
    <p>lista de predictii</p>
  );
};

export default PredictionList;