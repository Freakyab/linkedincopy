import React, { useRef, useEffect } from "react";
import axios from "axios";
import styles from "./index.module.css";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";


function LoginPage({ setUser, setId }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [invisible, setInvisible] = React.useState(false);
  const [text, setText] = React.useState("password");

  const blobRef = useRef(null);

  const handleSubmit = async (e) => {
    console.log("running");
    e.preventDefault();
    try {
      const res = await axios.get(
        "http://localhost:5000/testing/login?username=Temp1@1234&password=1234"
        // `https://api-dusky-pi.vercel.app/linkedin/login?username=${username}&password=${password}`
      );
      if (res.data.status === true) {
        setUser(true);
        setId(res.data.userId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const blob = blobRef.current;
    document.body.onpointermove = (e) => {
      let x = e.pageX;
      let y = e.pageY;
      if (blob) {
        blob.animate({
          left: `${x}px`,
          top: `${y}px`
        }, { duration: 3000, fill: "forwards" })
      }
    };
  }, [blobRef]);


  return (

    <div className={styles.container}>
      <div className={styles.blob} ref={blobRef}></div>
      <div className={styles.login}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputBox}>
            <input
              type="text"
              name="username"
              // placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span >Username</span>
          </div>
          <div className={styles.inputBox}>
            <input
              type={invisible ? "text" : "password"}
              name="password"
              // placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span >Password</span>
          </div>
          {invisible ? <AiFillEyeInvisible className={styles.icon} onClick={() => {
            setInvisible(!invisible)
          }} /> : <AiFillEye className={styles.icon} onClick={() => {
            setInvisible(!invisible)
          }} />}
          <button type="submit" className={styles.sumbitBtn}>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
