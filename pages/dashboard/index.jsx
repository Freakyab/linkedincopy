import React, { useState, useEffect } from "react";

import Post from "../component/post";
import Feed from "../component/feed";

function Dashboard(props) {
  const [windowScroll, setWindowScroll] = useState(0);
  const [onFeed, setOnFeed] = useState(false);
  console.log(onFeed);

  useEffect(() => {
    function handleScroll() {
      setWindowScroll(window.scrollY);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {onFeed ? (
        <Feed id = {props.id}  />
      ) : (
        <Post id={props.id} windowScroll={windowScroll} setOnFeed = {setOnFeed} onFeed = {onFeed}/>
      )}
    </>
  );
}

export default Dashboard;

