import styles from "./Todos.module.css";
import TodoItem from "./TodoItem";
import { BsPlus } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { useState } from "react";
const TODOS = [
  {
    id: 1,
    title: "Learn React",
    completed: true,
    createdAt: new Date(),
    completedAt: new Date(),
  },
  {
    id: 2,
    title: "Learn Redux",
    completed: false,
    createdAt: new Date(),
    completedAt: undefined,
  },
  {
    id: 3,
    title: "Learn React Router",
    completed: false,
    createdAt: new Date(),
    completedAt: undefined,
  },
  {
    id: 4,
    title: "Learn React Hooks",
    completed: false,
    createdAt: new Date(),
    completedAt: undefined,
  },
  {
    id: 5,
    title: "Learn React Context",
    completed: false,
    createdAt: new Date(),
    completedAt: undefined,
  },
];

function Todos() {
  const [input, setInput] = useState("");
  const [Todos, setTodos] = useState(TODOS);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    setTodos([
      ...Todos,
      {
        id: Todos.length + 1,
        title: input,
        completed: false,
        createdAt: new Date(),
        completedAt: undefined,
      },
    ]);
    setInput("");
  };

  const deleteTodo = (id) => {
    const newTodos = Todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };
  return (
    <>
      <h1>Todos List</h1>
      <div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pablo_Escobar_Mug.jpg/1200px-Pablo_Escobar_Mug.jpg"
          alt="profile"
          className={styles.img}
        />
      </div>
      <div className={styles.todos}>
        {Todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} deleteTodo={deleteTodo} />
        ))}
      </div>
      <form className={styles.addTodo} onSubmit={handleSubmit}>
        <BsPlus size={25} color="white" />
        <input
          type="text"
          value={input}
          name="addTodo"
          id="addTodo"
          placeholder="Add Task"
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <IoSendSharp size={25} color="white" onClick={handleSubmit} />
      </form>
    </>
  );
}

export default Todos;
