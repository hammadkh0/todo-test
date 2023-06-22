/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

const ConfirmationModal = (props) => {
  const dialogRef = useRef(null);

  const closeModal = () => {
    dialogRef.current.close();
    props.setShow(false);
  };

  useEffect(() => {
    if (props.show) {
      dialogRef.current.showModal();
    } else {
      // props will be updated when the user clicks on the cancel button
      closeModal();
    }
  }, [props.show]);

  return (
    <dialog ref={dialogRef} onClose={closeModal} className="border-none rounded-lg">
      <h3>Are you sure you want to delete the Todo</h3>
      <div className="flex gap-4 justify-center mt-4">
        <button
          className="rounded-md cursor-pointer p-2 w-24 text-white bg-[#FF495F] font-bold text-sm"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          className="rounded-md cursor-pointer p-2 w-24 text-white bg-[#4C7780] font-bold text-sm"
          onClick={props.confirmDeletion}
        >
          Confirm
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;
