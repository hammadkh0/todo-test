import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TodoItem from "./TodoItem";
import { toastError, toastSuccess } from "../../utils/toastMessages";

import { BsPlus } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";

import styles from "./Todos.module.css";

// eslint-disable-next-line react/prop-types
function Todos() {
  const inputRef = useRef(null);
  const [Todos, setTodos] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("jwt");
  const localTodos = JSON.parse(localStorage.getItem("saveLater"))?.map((todo) => todo.id) || [];

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
    // If input is empty return.
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
          inputRef.current.value = "";
        });
    }
  };

  const deleteTodo = (id) => {
    if (isLoggedIn && !localTodos.includes(id)) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
    }
    const newTodos = Todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem(
      "saveLater",
      JSON.stringify(newTodos.filter((todo) => localTodos.includes(todo.id)))
    );
  };

  const handleCompletion = async (id) => {
    if (isLoggedIn && !localTodos.includes(id)) {
      // if user is logged in, then update todo on backend.
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (!response.ok) {
        toastError("Something went wrong! Please try again.");
        return;
      }
    }
    // to check if the todo is completed or is set to incomplete
    let didTotoComplete = true;
    // update todo on client side as well.
    const newTodos = Todos.map((todo) => {
      if (todo.id === id) {
        if (todo.completed) {
          // if todo was completed, this means it will become incomplete so set the variable to False.
          didTotoComplete = false;
        }
        return {
          ...todo,
          completedAt: todo.completed ? undefined : new Date(),
          completed: !todo.completed,
        };
      }
      return todo;
    });
    setTodos(newTodos);
    // only update the todos in localStorage if no user exists. Otherwise only db updation is considered

    localStorage.setItem(
      "saveLater",
      JSON.stringify(newTodos.filter((todo) => localTodos.includes(todo.id)))
    );
    // return boolean value to check if todo was completed or not.
    return didTotoComplete;
  };

  const saveTodosToDB = () => {
    // 1. Remove the integer id from the locally saved todos.
    const todosToSave = Todos.map((todo) => ({ ...todo, id: undefined }));
    // 2. Send the todos to backend to save them.
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/todos/saveAll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ todos: todosToSave }),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "fail") {
          toastError(data.message);
          return;
        }
        // 3. Clear the todos from localStorage.
        localStorage.setItem("saveLater", JSON.stringify([]));
        toastSuccess("Todos saved successfully!");
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
      <ToastContainer />
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
          <button className={styles.saveButton} onClick={saveTodosToDB}>
            Save Todos to Database
          </button>
          <button className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
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
