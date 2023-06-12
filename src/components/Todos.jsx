import styles from "./Todos.module.css";
import TodoItem from "./TodoItem";
import { BsPlus } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { useEffect, useState } from "react";

function Todos({ isLoggedIn }) {
  const [input, setInput] = useState("");
  const [Todos, setTodos] = useState([]);

  useEffect(() => {
    const todos = localStorage.getItem("saveLater");
    if (todos) {
      setTodos(JSON.parse(todos));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    if (!isLoggedIn) {
      const updatedTodos = [
        ...Todos,
        {
          id: Todos.length + 1,
          title: input,
          completed: false,
          createdAt: new Date(),
        },
      ];
      localStorage.setItem("saveLater", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    }

    setInput("");
  };

  const deleteTodo = (id) => {
    const newTodos = Todos.filter((todo) => todo.id !== id);
    localStorage.setItem("saveLater", JSON.stringify(newTodos));
    setTodos(newTodos);
  };

  const handleCompletion = (id) => {
    const newTodos = Todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completedAt: todo.completed ? undefined : new Date(),
          completed: !todo.completed,
        };
      }
      return todo;
    });
    localStorage.setItem("saveLater", JSON.stringify(newTodos));
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
        {Todos.map((todo, idx) => (
          <TodoItem key={idx} todo={todo} deleteTodo={deleteTodo} onComplete={handleCompletion} />
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
