import { useRef, useState } from "react";
import PropTypes from "prop-types";

import { TbCircle, TbCircleCheckFilled } from "react-icons/tb";
import { RxDragHandleDots2 } from "react-icons/rx";

import styles from "./Todos.module.css";
import bellSound from "../../assets/mixkit-achievement-bell-600-[AudioTrimmer.com].wav";

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    completedAt: PropTypes.instanceOf(Date),
  }).isRequired,
  deleteTodo: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

function TodoItem({ todo, deleteTodo, onComplete }) {
  const [hovered, setHovered] = useState(false);
  const audioRef = useRef(null);

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
      className={styles.todoItem}
    >
      <audio src={bellSound} ref={audioRef}></audio>

      <div
        className={styles.title}
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
          className={styles.titleText}
          style={todo.completed ? { textDecoration: "line-through" } : null}
        >
          {todo.title}
        </p>
      </div>
      <span>
        <RxDragHandleDots2
          size={22}
          onClick={() => {
            deleteTodo(todo.id);
          }}
        />
      </span>
    </div>
  );
}

export default TodoItem;
