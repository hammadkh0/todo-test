import { TbCircle, TbCircleCheckFilled } from "react-icons/tb";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useState } from "react";
import styles from "./Todos.module.css";
import PropTypes from "prop-types";

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    completedAt: PropTypes.instanceOf(Date),
  }).isRequired,
  deleteTodo: PropTypes.func.isRequired,
};

function TodoItem({ todo, deleteTodo }) {
  const [hovered, setHovered] = useState(false);

  const handleTodoHover = () => {
    setHovered(true);
  };

  const handleTodoLeave = () => {
    setHovered(false);
  };

  const Icon = hovered ? (
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
      <div className={styles.title}>
        <span>{Icon}</span>
        <p className={styles.titleText}>{todo.title}</p>
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
