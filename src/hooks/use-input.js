import { useReducer } from "react";


// const initialInputState = {
//   value: '',
//   isTouched: false
// }

const inputStateReducer = (state, action) => {
  if (action.type === 'INPUT') {
    return {
      value: action.value,
      isTouched: state.isTouched,
    }
  }
  if (action.type === 'BLUR') {
    return {
      value: state.value,
      isTouched: true
    }
  }
  if (action.type === 'RESET') {
    return {
      value: '',
      isTouched: false
    }
  }
}

const useInput = (validateValue, input_type = 'TEXT', initialInputState = {
  value: '',
  isTouched: false
}) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, initialInputState);

  const valueIsValid = validateValue(inputState.value)

  const hasError = !valueIsValid && inputState.isTouched

  const valueChangeHandler = (event) => {
    if (input_type === 'TEXT') {
      dispatch({type: 'INPUT', value: event.target.value});
    } else if (input_type === 'NON_TEXT') {
      dispatch({type: 'INPUT', value: event.value})
    }
  };

  const inputBlurHandler = (event) => {
    dispatch({type: 'BLUR'});
  };

  const reset = () => {
    dispatch({type: 'RESET'});
  };

  return {
    value: inputState.value,
    touched: inputState.isTouched,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset
  };
};

export default useInput;