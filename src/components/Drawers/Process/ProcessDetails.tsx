import { toast } from "react-toastify";
import Drawer from "../../../ui/Drawer";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import Loading from "../../../ui/Loading";
import { BiX } from "react-icons/bi";
import moment from "moment";

interface ProcessProps {
  closeDrawerHandler: () => void;
  id: string | undefined;
}

const ProcessDetails: React.FC<ProcessProps> = ({ closeDrawerHandler, id }) => {
  const [cookies] = useCookies();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [process, setProcess] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [creator, setCreator] = useState<any | undefined>();

  const fetchProcessDetails = async (id: string) => {
    try {
      // @ts-ignore
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + `process/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies?.access_token}`,
          },
        }
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setProcess(data.process.process);
      setDescription(data.process?.description);
      setDescription(data.process.creator);
    } catch (error: any) {
      toast.error(error.messsage || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProcessDetails(id || "");
  }, [id]);

  return (
    <Drawer closeDrawerHandler={closeDrawerHandler}>
      <div
        className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[450px] bg-white right-0 top-0 z-10 py-3"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
        }}
      >
        <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
          <BiX onClick={closeDrawerHandler} size="26px" />
          Production Process
        </h1>

        <div className="mt-8 px-5">
          <h2 className="text-2xl font-semibold py-5 text-center mb-6 border-y bg-[#f9fafc]">
            Production Process Details
          </h2>

          {isLoading && <Loading />}
          {!isLoading && (
            <div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Created By</p>
                <p>{creator?.first_name + " " + creator?.last_name}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Process</p>
                <p>{process}</p>
              </div>
              <div className="mt-3 mb-5">
                <p className="font-semibold">Description</p>
                <p>{description || "N/A"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ProcessDetails;
