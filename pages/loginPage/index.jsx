import React from "react";
import axios from "axios";

function LoginPage({ setUser, setId}) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e) => {
    console.log("running");
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://api-dusky-pi.vercel.app/linkedin/login?username=${username}&password=${password}`
      );
      if (res.data.status === true) {
        setUser(true);
        setId(res.data.userId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default LoginPage;
