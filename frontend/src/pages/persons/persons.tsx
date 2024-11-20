import { useEffect, useState } from "react";
import { ListPersonsByName } from "../../../wailsjs/go/main/App";
import { DataTable } from "@/components/person/DataTables";
import { columns } from "@/components/person/columns";
import { data } from "wailsjs/go/models";

function PersonsPage() {
  const [personData, setPersonData] = useState<data.Person[]>();

  useEffect(() => {
    async function fetchData() {
      const dataFromDb = await ListPersonsByName();
      setPersonData(dataFromDb);
    }
    fetchData();
  }, []);

  return (
    <>
      {personData && (
        <div className="w-full">
          <DataTable columns={columns} data={personData} />
        </div>
      )}
    </>
  );
}

export default PersonsPage;
