import RunList from "../components/Runs/RunList";


const Runs = () => {
  return (
    <div className="surface-0 mt-4 ml-4 mr-4">
      <div className="font-medium text-3xl text-900 mb-3">
        Detecțiile dumneavoastră
      </div>
      <div className="text-500 mb-5">
        Mai jos sunt afișate detecțiile create de dumneavoastră.
      </div>
      <RunList></RunList>
    </div>
  );
};

export default Runs;