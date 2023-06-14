import { useState } from "react";
import { ToastContainer } from "react-toastify";

import styles from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../utils/toastMessages";

// eslint-disable-next-line react/prop-types
const LoginForm = ({ navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ email, password }),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "fail") {
          toastError(data.message);
          return;
        }
        toastSuccess("Login Successfull");
        setTimeout(() => {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify({ name: data.name, image: data.image }));
          navigate("/");
        }, 1500);
      })
      .catch((err) => {
        toastError(err.message);
      });
  };
  return (
    <>
      <ToastContainer />
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </>
  );
};

// eslint-disable-next-line react/prop-types
const SignupForm = ({ navigate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log({ name, email, password, imagePreview });
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ name, email, password, image: imagePreview }),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "fail") {
          toastError(data.message);
          return;
        }
        toastSuccess("Signup Successfull");
        setTimeout(() => {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify({ name: data.name, image: data.image }));
          navigate("/");
        }, 1500);
      })
      .catch((err) => toastError(err.message));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  return (
    <>
      <ToastContainer />

      <form onSubmit={handleSignup} className={styles.form}>
        <div>
          <label htmlFor="email">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            autoComplete="on"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            autoComplete="on"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {imagePreview && <img src={imagePreview} alt="Selected" style={{ width: "100px" }} />}
        <button>Signup</button>
      </form>
    </>
  );
};

// eslint-disable-next-line react/prop-types
function Auth({ type }) {
  const navigate = useNavigate();
  return type === "login" ? <LoginForm navigate={navigate} /> : <SignupForm navigate={navigate} />;
}

export default Auth;
