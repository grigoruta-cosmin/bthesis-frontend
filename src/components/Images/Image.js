import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";

const Image = (props) => {
  const [img, setImg] = useState();
  const authCtx = useContext(AuthContext)
  useEffect(() => {
    fetch(`/image/${props.imageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authCtx.token}`
      }
    }).then((res) => {
      if (res.ok) {
        return res.blob()
      } else {

      }
    }).then((data) => {
      const imageObject = URL.createObjectURL(data);
      setImg(imageObject);
    });
  }, [props.imageId]);

  return (
    <img src={img} style={{maxWidth: 100 + "%"}}></img>
  )
};

export default Image;