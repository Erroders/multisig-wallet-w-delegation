import { SetStateAction } from "react";
import { addSigner } from "../../controllers/SignerController";
import { Signer, SignerMetadata } from "../../utils/types";

interface AddSignerProps {
  showAddSignerBox: boolean;
  setShowAddSignerBox: (value: SetStateAction<boolean>) => void;
  signer: Signer | null;
}

const AddSignerPage = ({
  showAddSignerBox,
  signer,
  setShowAddSignerBox,
}: AddSignerProps) => {
  return (
    <section
      className={
        "flex flex-col space-y-3 bg-gray-100 px-10 py-10" +
        (showAddSignerBox ? "" : " hidden ")
      }
    >
      <div className="flex justify-between">
        <h2 className="my-auto  text-xl font-semibold">Add Signer</h2>

        <button
          className="btn-dark"
          onClick={() => {
            setShowAddSignerBox(false);
          }}
        >
          <span className="mr-2">x</span> Close
        </button>
      </div>

      <form
        action=""
        className="space-y-4"
        onSubmit={(e: any) => {
          e.preventDefault();
          const data: SignerMetadata = {
            name: e.target.name.value,
            contactNo: e.target.number.value,
            email: e.target.email.value,
            walletAddress: e.target.walletAddress.value,
            role: e.target.role.value,
            remarks: e.target.remarks.value,
          };
          const signerData: Signer = {
            address: e.target.walletAddress.value,
            weight: 0,
            delegateTo: "",
            metadata: data as SignerMetadata,
            signer: null,
          };

          addSigner(signer!.signer, signerData);
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="name"
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                placeholder="Enter Name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="number" className="text-sm font-medium">
              Number
            </label>

            <div className="relative mt-1">
              <input
                type="tel"
                id="number"
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                placeholder="Enter Number"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="address" className="text-sm font-medium">
            Wallet Address
          </label>

          <div className="relative mt-1">
            <input
              type="text"
              id="walletAddress"
              className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
              placeholder="Enter Wallet Address"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <div className="relative mt-1">
              <input
                type="email"
                id="email"
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                placeholder="Enter email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="Role" className="text-sm font-medium">
              Role
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="role"
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                placeholder="Enter Role"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium " htmlFor="remarks">
            Message
          </label>
          <textarea
            className="w-full rounded-lg border-gray-200 p-3 text-sm shadow-md"
            placeholder="Remarks"
            rows={8}
            id="remarks"
          ></textarea>
        </div>

        <button
          type="submit"
          className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
        >
          Add Signer
        </button>
      </form>
    </section>
  );
};

export default AddSignerPage;