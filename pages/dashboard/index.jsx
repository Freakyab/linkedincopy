import React, { useState, useEffect } from "react";

import Post from "../component/post";
import Feed from "../component/feed";
import Test from "../component/testingProfile"
import Test1 from "../component/testingFeed"

function Dashboard(props) {
  const [windowScroll, setWindowScroll] = useState(0);
  const [onFeed, setOnFeed] = useState(true);
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
        // <Feed id = {props.id}  />
        <Test  id = {props.id} onFeed ={onFeed} setOnFeed = {setOnFeed} />
      ) : (
        <Test1 id = {props.id} onFeed ={onFeed} setOnFeed = {setOnFeed} />
        // <Post id={props.id} windowScroll={windowScroll} setOnFeed = {setOnFeed} onFeed = {onFeed}/>

      )}
    </>
  );
}

export default Dashboard;

