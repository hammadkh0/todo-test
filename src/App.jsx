import Todos from "./components/Todos";
import "./App.css";
function App() {
  const isLoggedIn = localStorage.getItem("jwt");
  return (
    <>
      <Todos isLoggedIn={isLoggedIn} />
    </>
  );
}

export default App;
