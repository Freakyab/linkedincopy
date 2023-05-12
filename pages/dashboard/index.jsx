import React, { useState, useEffect } from "react";

import Post from "../../pages/post"
import Feed from "../../pages/feed"
// import Test from "../component/testingProfile"
// import Test1 from "../component/testingFeed"

function Dashboard(props) {
  const { id,name } = props;
  const [windowScroll, setWindowScroll] = useState(0);
  const [onFeed, setOnFeed] = useState(false);
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
        <Feed id={id} windowScroll={windowScroll} setOnFeed={setOnFeed} onFeed={onFeed} name={name}/>
        // <Test  id = {props.id} onFeed ={onFeed} setOnFeed = {setOnFeed} />
      ) : (
        // <Test1 id = {props.id} onFeed ={onFeed} setOnFeed = {setOnFeed} />
        <Post id={id} windowScroll={windowScroll} setOnFeed={setOnFeed} onFeed={onFeed} />

      )}
    </>
  );
}

export default Dashboard;

