import { Button } from "primereact/button";
import { CascadeSelect } from "primereact/cascadeselect"
import useInput from "../../hooks/use-input";
import { Slider } from "primereact/slider";


const modelTypes = [
  {
    name: 'Tiny YoloV3',
    code: 'yolov3-tiny',
    variants: [
      {
        label: 'Tiny YoloV3 Pretrained',
        value: 'yolov3-tiny-pretrained'
      },
      {
        label: 'Tiny YoloV3 Fine-Tuned',
        value: 'yolov3-tiny-finetuned'
      },
      {
        label: 'Tiny YoloV3 End-to-End',
        value: 'yolov3-tiny-e2e'
      }
    ]
  },
  {
    name: 'YoloV3',
    code: 'yolov3',
    variants: [
      {
        label: 'YoloV3 Pretrained',
        value: 'yolov3-pretrained'
      },
      {
        label: 'YoloV3 Fine-Tuned',
        value: 'yolov3-finetuned'
      },
      {
        label: 'YoloV3 End-to-End',
        value: 'yolov3-e2e'
      }
    ]
  }
]

const RunFormParameterStep = (props) => {
  const {
    value: modelTypeValue,
    touched: modelTypeIsTouched,
    isValid: modelTypeIsValid,
    hasError: modelTypeHasError,
    valueChangeHandler: modelTypeChangeHandler,
    inputBlurHandler: modelTypeBlurHandler,
    reset: resetModelType
  } = useInput(value => !!value, 'NON_TEXT', props.initialSubFormState.modelType)
  
  const {
    value: confidenceThresholdValue,
    touched: confidenceThresholdIsTouched,
    isValid: confidenceThresholdIsValid,
    hasErorr: confidenceThresholdHasError,
    valueChangeHandler: confidenceThresholdChangeHandler,
    inputBlurHandler: confidenceThresholdBlurHandler,
    reset: resetConfidenceThreshold
  } = useInput(value => value > 0 && value < 1, 'NON_TEXT', props.initialSubFormState.confidenceThreshold)

  const {
    value: maximumDeterminationsValue,
    touched: maximumDeterminationsIsTouched,
    isValid: maximumDeterminationsIsValid,
    hasErorr: maximumDeterminationsHasError,
    valueChangeHandler: maximumDeterminationsChangeHandler,
    inputBlurHandler: maximumDeterminationsBlurHandler,
    reset: resetMaximumDeterminations
  } = useInput(value => value >= 500 && value <= 1500, 'NON_TEXT', props.initialSubFormState.maximumDeterminations)

  const prevStepHandler = () => {
    props.onChanges({
      modelType: {
        value: modelTypeValue,
        isTouched: modelTypeIsTouched
      }
    });
    props.onPrevStep();
  }
  
  const nextStepHandler = () => {
    if (!subFormIsValid) {
      return;
    }
    props.onChanges({
      modelType: {
        value: modelTypeValue,
        isTouched: modelTypeIsTouched
      }
    });
    props.onNextStep();
  }

  let subFormIsValid = false;
  if (modelTypeIsValid && maximumDeterminationsIsValid && confidenceThresholdIsValid) {
    subFormIsValid = true;
  }

  const modelTypeClasses = modelTypeHasError ? "p-invalid": "";

  return (
    <> 
      <div className="field">
        <label htmlFor="modelType" className="block text-900 font-medium mb-2">Selectează modelul</label>
        <CascadeSelect
          className={modelTypeClasses}
          id="modelType"
          aria-describedby="modelType-help"
          value={modelTypeValue}
          options={modelTypes}
          optionLabel={"label"}
          optionGroupLabel={"name"}
          optionGroupChildren={['variants']}
          onChange={modelTypeChangeHandler}
          onBlur={modelTypeBlurHandler}
        />
        {
          modelTypeHasError && (
            <span id="modelType-help" className="p-error block">
              Selecția unui model este obligatorie
            </span>
          )
        }
      </div>
      <div className="field">
        <label htmlFor="confidenceThreshold" className="block text-900 font-medium mb-2">Pragul de încredere: {confidenceThresholdValue}</label>
        <Slider
          value={confidenceThresholdValue}
          // onChange={(e) => console.log(e)}
          onChange={confidenceThresholdChangeHandler}
          min={0.1}
          max={0.9}
          step={0.05}
          // onBlur={maximumDeterminationsBlurHandler}
          style={{width: 28 + 'rem', height: 0.35+'rem'}}
        />
      </div>
      <div className="field">
        <label htmlFor="maximumDeterminations" className="block text-900 font-medium mb-2">Numărul maxim de determinări: {maximumDeterminationsValue}</label>
        <Slider
          value={maximumDeterminationsValue}
          min={500}
          max={1500}
          step={100}
          onChange={maximumDeterminationsChangeHandler}
          style={{width: 28 + 'rem', height: 0.4+'rem'}}
        />
      </div>
      <span className="p-buttonset">
        <Button label="Pasul anterior" onClick={prevStepHandler}></Button>
        <Button label="Pasul următor" onClick={nextStepHandler} disabled={!subFormIsValid}></Button>
      </span>
    </>
  );
};

export default RunFormParameterStep;