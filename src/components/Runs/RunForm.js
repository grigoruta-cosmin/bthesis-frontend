import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";
import { useContext, useRef, useState } from "react";
import RunFormDefineStep from "./RunFormDefineStep";
import RunFormParameterStep from "./RunFormParameterStep";
import RunFormConfirmationStep from "./RunFormConfirmationStep";
import AuthContext from "../../store/auth-context";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

const initialFormState = {
  runName: {
    value: "",
    isTouched: false,
  },
  albumData: {
    value: "",
    isTouched: false,
  },
  modelType: {
    value: "",
    isTouched: false,
  },
  confidenceThreshold: {
    value: 0.5,
    isTouched: false,
  },
  maximumDeterminations: {
    value: 1000,
    isTouched: false,
  },
};

const RunForm = () => {
  const toastRef = useRef();
  const [loadingState, setLoadingState] = useState(false);
  const authCtx = useContext(AuthContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const navigate = useNavigate();
  // console.log(location)
  // console.log(location.pathname.split('/')[location.pathname.split('/').length - 1])
  const steps = [
    { label: "Definirea Detecție" },
    { label: "Alegerea Parametrilor" },
    { label: "Confirmare" },
  ];

  const prevStepHandler = () => {
    console.log("prev apasat");
    if (activeIndex === 0) {
      return;
    }
    setActiveIndex((prevState) => prevState - 1);
  };

  const nextStepHandler = () => {
    console.log("next apasat");
    if (activeIndex === 2) {
      return;
    }
    setActiveIndex((prevState) => prevState + 1);
  };

  const handleChanges = (subFormData) => {
    console.log(subFormData);
    setFormData((prevState) => {
      return { ...prevState, ...subFormData };
    });
  };

  const handleSubmit = (data) => {
    console.log("data din handle submit", data);
    setLoadingState(true);
    fetch("/run", {
      method: "POST",
      body: JSON.stringify({
        run_name: data.runName,
        album_id: data.albumId,
        confidence_threshold: data.confidenceThreshold,
        model_type: data.modelType,
        maximum_determinations: data.maximumDeterminations,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          setLoadingState(false);
          return res.json().then((data) => {
            toastRef.current.show({
              severity: "error",
              summary: "Eroare",
              detail: data.msg,
            });
          });
        }
      })
      .then((data) => {
        setLoadingState(false);
        navigate(`/runs/${data.id}`);
      });
  };

  return (
    <>
      {!loadingState ? (
        <div className="flex align-items-center justify-content-center">
          <div className="surface-card p-4 shadow-2 border-round w-full">
            <Toast ref={toastRef} />
            <Steps model={steps} activeIndex={activeIndex}></Steps>
            {activeIndex === 0 && (
              <RunFormDefineStep
                initialSubFormState={{
                  runName: formData.runName,
                  albumData: formData.albumData,
                }}
                onNextStep={nextStepHandler}
                onChanges={handleChanges}
              />
            )}
            {activeIndex === 1 && (
              <RunFormParameterStep
                initialSubFormState={{
                  modelType: formData.modelType,
                  confidenceThreshold: formData.confidenceThreshold,
                  maximumDeterminations: formData.maximumDeterminations,
                }}
                onPrevStep={prevStepHandler}
                onNextStep={nextStepHandler}
                onChanges={handleChanges}
              />
            )}
            {activeIndex === 2 && (
              <RunFormConfirmationStep
                formState={formData}
                onPrevStep={prevStepHandler}
                onSubmit={handleSubmit}
                onChanges={handleChanges}
              />
            )}
          </div>
        </div>
      ) : (
        <ProgressSpinner></ProgressSpinner>
      )}
    </>
  );
};

export default RunForm;
