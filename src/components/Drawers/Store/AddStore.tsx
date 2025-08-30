import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import Drawer from "../../../ui/Drawer";
import { BiX } from "react-icons/bi";
import { useState } from "react";
import { useAddStoreMutation } from "../../../redux/api/api";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

interface AddStoreProps {
  fetchStoresHandler: () => void,
  closeDrawerHandler: () => void
}

const AddStore: React.FC<AddStoreProps> = ({ closeDrawerHandler, fetchStoresHandler }) => {
  const [cookies, setCookie] = useCookies();
  const [isAddingStore, setIsAddingStore] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>();
  const [gst, setGst] = useState<string | undefined>();
  const [addressLine1, setAddressLine1] = useState<string | undefined>();
  const [addressLine2, setAddressLine2] = useState<string | undefined>();
  const [pincode, setPincode] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [state, setState] = useState<string | undefined>();

  const [addStore] = useAddStoreMutation();

  const addStoreHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !addressLine1 || !city || !state || name.trim().length === 0 || addressLine1.trim().length === 0 || city.trim().length === 0 || state.trim().length === 0) {
      toast.error('Please provide all the required fields');
      return;
    }
    try {
      setIsAddingStore(true);
      const response = await addStore({
        name: name,
        gst_number: gst,
        address_line1: addressLine1,
        address_line2: addressLine2,
        pincode: pincode,
        city: city,
        state: state
      }).unwrap();    
      toast.success(response.message);
      fetchStoresHandler();
      closeDrawerHandler();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.log(error);
    } finally {
      setIsAddingStore(false);
    }
  }
  
    return (
      <Drawer closeDrawerHandler={closeDrawerHandler}>
        <div
          className="absolute overflow-auto h-[100vh] w-[90vw] md:w-[60vw] bg-white right-0 top-0 z-10 py-3"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px",
          }}
        >
          <h1 className="px-4 flex gap-x-2 items-center text-xl py-3 border-b">
            <BiX onClick={closeDrawerHandler} size="26px" />
            Store
          </h1>

          <div className="mt-8 px-5">
            <h2 className="text-2xl font-bold text-white py-5 text-center mb-6 border-y bg-teal-500">
              Add New Store
            </h2>

            <form onSubmit={addStoreHandler}
            className="max-w-4xl mx-auto p-8 bg-white space-y-5">
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Store Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Store Name"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">GST Number</FormLabel>
                <Input
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  type="text"
                  placeholder="GST Number"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">Address Line 1</FormLabel>
                <Input
                  value={addressLine1}
                  className="no-scrollbar"
                  onChange={(e) => setAddressLine1(e.target.value)}
                  type="text"
                  placeholder="Address Line 1"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Address Line 2</FormLabel>
                <Input
                  value={addressLine2}
                  className="no-scrollbar"
                  onChange={(e) => setAddressLine2(e.target.value)}
                  type="text"
                  placeholder="Address Line 2"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5">
                <FormLabel fontWeight="bold">Pincode</FormLabel>
                <Input
                  className="no-scrollbar"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  type="text"
                  placeholder="Pincode"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">City</FormLabel>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  type="text"
                  placeholder="City"
                />
              </FormControl>
              <FormControl className="mt-3 mb-5" isRequired>
                <FormLabel fontWeight="bold">State</FormLabel>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  type="text"
                  placeholder="State"
                />
              </FormControl>
              <Button
                isLoading={isAddingStore}
                backgroundColor="#0d9488"
                color="#ffffff"
                type="submit"
                _hover={{backgroundColor:"#14b8a6"}}
                className="mt-5 w-full py-3  text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </Drawer>
    );
  };

  export default AddStore;