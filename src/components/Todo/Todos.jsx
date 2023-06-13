import styles from "./Todos.module.css";
import TodoItem from "./TodoItem";
import { BsPlus } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Todos() {
  const inputRef = useRef(null);

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
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/todos`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setTodos([...data, ...todos]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputRef.current.value) return;
    if (!isLoggedIn) {
      const updatedTodos = [
        ...Todos,
        {
          id: Todos.length ? Todos[Todos.length - 1].id + 1 : 1, //get last element id and add 1 to it.
          title: inputRef.current.value,
          completed: false,
          createdAt: new Date(),
        },
      ];
      localStorage.setItem("saveLater", JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
      inputRef.current.value = "";
    } else {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ title: inputRef.current.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTodos([...Todos, data]);
        });
    }
  };

  const deleteTodo = (id) => {
    if (isLoggedIn) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/todos/${id}`, {
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
    if (isLoggedIn) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
    }
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
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/todos/saveAll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(Todos),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("saveLater", JSON.stringify([]));
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
        <BsPlus
          size={25}
          color="white"
          onClick={() => {
            inputRef.current.focus();
          }}
        />
        <input type="text" name="addTodo" id="addTodo" placeholder="Add Task" ref={inputRef} />
        <IoSendSharp size={25} color="white" onClick={handleSubmit} />
      </form>
    </>
  );
}

export default Todos;
