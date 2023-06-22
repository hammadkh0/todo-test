import { useRef, useState } from "react";
import PropTypes from "prop-types";

import { TbCircle, TbCircleCheckFilled } from "react-icons/tb";
import { RxDragHandleDots2 } from "react-icons/rx";

import bellSound from "../../assets/mixkit-achievement-bell-600-[AudioTrimmer.com].wav";
import ConfirmationModal from "../Modal/ConfirmationModal";

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired | PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired | PropTypes.string.isRequired,
    completedAt: PropTypes.instanceOf(Date),
  }).isRequired,
  deleteTodo: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};
function TodoItem({ todo, deleteTodo, onComplete }) {
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  const audioRef = useRef(null);

  // get the time of creation of todo.
  const createdAt = new Date(todo.createdAt);
  // format the createdAt date and time to a readable format.
  const formattedTime = createdAt.toLocaleTimeString();
  const formattedDate = createdAt.toLocaleDateString();
  // get the time of completion of todo.
  const completedAt = new Date(todo.completedAt) || null;
  // format the completedAt date and time to a readable format.
  const formattedCompletedTime = completedAt ? completedAt.toLocaleTimeString() : null;
  const formattedCompletedDate = completedAt ? completedAt.toLocaleDateString() : null;

  const handleTodoHover = () => {
    setHovered(true);
  };
  const handleTodoLeave = () => {
    setHovered(false);
  };

  const Icon = todo.completed ? (
    <TbCircleCheckFilled size={25} color="#A4967B" />
  ) : hovered ? (
    <TbCircleCheckFilled size={25} color="#A4967B" />
  ) : (
    <TbCircle size={25} color="#A4967B" />
  );
  return (
    <div
      key={todo.id}
      onMouseOver={handleTodoHover}
      onMouseOut={handleTodoLeave}
      className="p-4 flex flex-col bg-[#EDECE7] cursor-pointer border-b border-b-[#aaaaaa] last:border-b-0"
    >
      <div className="flex justify-between">
        <audio src={bellSound} ref={audioRef}></audio>
        <div
          className="flex gap-4"
          onClick={() => {
            onComplete(todo.id).then((didTodoComplete) => {
              if (didTodoComplete) {
                audioRef.current.play();
              }
            });
          }}
        >
          <span>{Icon}</span>
          <p
            className="inline-block min-w-[10rem] w-[18rem] text-left font-normal text-base m-0"
            style={todo.completed ? { textDecoration: "line-through" } : null}
          >
            {todo.title}
          </p>
        </div>
        <span>
          <RxDragHandleDots2
            size={22}
            onClick={() => {
              setShow(true);
            }}
          />
        </span>
      </div>
      <div className="text-left text-[13px]">
        {todo.completed ? (
          <span>
            Completed At : {formattedCompletedTime} {formattedCompletedDate}
          </span>
        ) : (
          <span>
            Pending: {formattedTime} {formattedDate}
          </span>
        )}
      </div>
      <ConfirmationModal
        confirmDeletion={() => {
          deleteTodo(todo.id);
          setShow(false);
        }}
        show={show}
        setShow={setShow}
      />
    </div>
  );
}
export default TodoItem;
