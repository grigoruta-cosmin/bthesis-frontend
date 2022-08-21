import { Outlet } from 'react-router-dom';
import RunForm from '../components/Runs/RunForm';

const NewRun = () => {
  return (
    <div className="surface-0 mt-4 ml-4 mr-4">
      <RunForm></RunForm>
    </div>
  );
};

export default NewRun;