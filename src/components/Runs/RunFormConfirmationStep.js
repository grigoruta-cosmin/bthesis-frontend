import { Button } from "primereact/button";

const RunFormConfirmationStep = (props) => {
  const prevStepHandler = () => {
    props.onPrevStep();
  }
  
  const handleSubmit = () => {
    const data = {
      runName: props.formState.runName.value,
      albumId: props.formState.albumData.value.id,
      modelType: props.formState.modelType.value.value,
      confidenceThreshold: props.formState.confidenceThreshold.value,
      maximumDeterminations: props.formState.maximumDeterminations.value
    }
    props.onSubmit(data)
  }

  return (
    <>
      <div className="field">
        <p className="block text-900 font-medium mb-2">Numele detecției: {props.formState.runName.value}</p>
      </div>
      <div className="field">
        <p className="block text-900 font-medium mb-2">Albumul selectat: {props.formState.albumData.value.name}</p>
      </div>
      <div className="field">
        <p className="block text-900 font-medium mb-2">Modelul selectat: {props.formState.modelType.value.label}</p>
      </div>
      <div className="field">
        <p className="block text-900 font-medium mb-2">Pragul de încredere: {props.formState.confidenceThreshold.value}</p>
      </div>
      <div className="field">
        <p className="block text-900 font-medium mb-2">Numărul maxim de determinări: {props.formState.maximumDeterminations.value}</p>
      </div>
      <span className="p-buttonset">
        <Button label="Pasul anterior" onClick={prevStepHandler}></Button>
        <Button label="Confirmare" onClick={handleSubmit}></Button>
      </span>
    </>
  );
};

export default RunFormConfirmationStep;