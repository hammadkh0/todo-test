/* eslint-disable react/prop-types */
import { BsPlus } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";

const TodoInput = ({ handleSubmit, inputRef }) => {
  return (
    <form
      className="flex w-[40%] my-0 mx-auto gap-[10px] bg-[#424242a4] rounded-lg mt-4 p-[10px]"
      onSubmit={handleSubmit}
    >
      <BsPlus
        size={25}
        color="white"
        onClick={() => {
          inputRef.current.focus();
        }}
      />
      <input
        className="w-[88%] text-white text-lg bg-transparent border-none outline-none placeholder:text-[#CAC6C6]"
        type="text"
        name="addTodo"
        id="addTodo"
        placeholder="Add Task"
        ref={inputRef}
      />
      <IoSendSharp size={25} color="white" onClick={handleSubmit} />
    </form>
  );
};

export default TodoInput;
