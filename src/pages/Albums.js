import { Button } from "primereact/button";
import AlbumItem from "../components/Albums/AlbumItem";
import AlbumList from "../components/Albums/AlbumList";

const Albums = (props) => {
  return (
    <div className="surface-0 mt-4 ml-4 mr-4">
      <div className="font-medium text-3xl text-900 mb-3">
        Albumele dumneavoastră
      </div>
      <div className="text-500 mb-5">
        Mai jos sunt afișate albumele create de dumneavoastră.
      </div>
      <AlbumList></AlbumList>
    </div>
  );
};

export default Albums;
