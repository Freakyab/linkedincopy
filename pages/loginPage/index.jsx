import React, { useRef, useEffect } from "react";
import axios from "axios";
import styles from "./index.module.css";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function LoginPage({ setUser, setId, setName }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [invisible, setInvisible] = React.useState(false);

  const blobRef = useRef(null);

  const msg = (type) => {
    if (type === "success") {
      toast.success("Login Successfull", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
      });
    }
    else if(type === "server"){
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
      });
    }
    else {
      toast.error("Login Failed", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
      });
    }
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.get(
          "http://localhost:5000/testing/login?username=" + username + "&password=" + password
        );
        if (res.data.status === true) {
          msg("success");
          setUser(true);
          setId(res.data.userId);
          setName(res.data.name);
        }
        else {
          msg("error");
        }
      } catch (err) {
        msg("server");
        console.log(err);
      }
    };

    useEffect(() => {
      const blob = blobRef.current;
      document.body.onpointermove = (e) => {
        let x = e.pageX - 450;
        let y = e.pageY - 50;
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
        <div className={styles.login}>
          <div className={styles.blob} ref={blobRef}></div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputBox}>
              <input
                type="text"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span >Username</span>
            </div>
            <div className={styles.inputBox}>
              <input
                type={invisible ? "text" : "password"}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span >Password</span>
              {invisible ? <AiFillEyeInvisible className={styles.icon} onClick={() => {
                setInvisible(!invisible)
              }} /> : <AiFillEye className={styles.icon} onClick={() => {
                setInvisible(!invisible)
              }} />}
            </div>
            <button type="submit" className={styles.sumbitBtn}>Submit</button>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  }

  export default LoginPage;

