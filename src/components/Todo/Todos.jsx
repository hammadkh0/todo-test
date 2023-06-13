import styles from "./Todos.module.css";
import TodoItem from "./TodoItem";
import { BsPlus } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Todos() {
  const [input, setInput] = useState("");
  const [Todos, setTodos] = useState([]);
  const isLoggedIn = !!localStorage.getItem("jwt");
  const navigate = useNavigate();

  const image =
    JSON.parse(localStorage.getItem("user"))?.image ||
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pablo_Escobar_Mug.jpg/1200px-Pablo_Escobar_Mug.jpg";
  // get logged user image or a default image

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("saveLater")) || [];
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      setTodos(todos);
    } else {
      fetch("http://localhost:5000/api/v1/todos", { headers: { Authorization: `Bearer ${jwt}` } })
        .then((res) => res.json())
        .then((data) => {
          setTodos(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    if (!isLoggedIn) {
      const updatedTodos = [
        ...Todos,
        {
          id: Todos.length ? Todos[Todos.length - 1].id + 1 : 1, //get last element id and add 1 to it.
          title: input,
          completed: false,
          createdAt: new Date(),
        },
      ];
      localStorage.setItem("saveLater", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } else {
      fetch("http://localhost:5000/api/v1/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ title: input }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTodos([...Todos, data]);
        });
    }

    setInput("");
  };

  const deleteTodo = (id) => {
    if (isLoggedIn) {
      fetch(`http://localhost:5000/api/v1/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
    }
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

  const saveTodosToDB = () => {
    fetch("http://localhost:5000/api/v1/todos/saveAll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(Todos),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    // refresh page to update navbar
    window.location.reload();
  };

  return (
    <>
      {!isLoggedIn && (
        <p>
          <span className="login" onClick={() => navigate("/login")}>
            Login
          </span>{" "}
          or{" "}
          <span className="signup" onClick={() => navigate("/signup")}>
            Signup
          </span>{" "}
          to Save Todos
        </p>
      )}
      <div>
        <img src={image} alt="profile" className={styles.img} />
      </div>
      {isLoggedIn ? (
        <div>
          <button onClick={saveTodosToDB}>Save Todos to Database</button>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <> </>
      )}
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
