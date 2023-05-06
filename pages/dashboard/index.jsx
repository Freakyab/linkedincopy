import React, { useState, useEffect } from "react";

import Post from "../../pages/post"
import Feed from "../../pages/feed"
// import Test from "../component/testingProfile"
// import Test1 from "../component/testingFeed"

function Dashboard(props) {
  const { id } = "6406e421eecad9672affbdd0";
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
        <Feed id={id} windowScroll={windowScroll} setOnFeed={setOnFeed} onFeed={onFeed} />
        // <Test  id = {props.id} onFeed ={onFeed} setOnFeed = {setOnFeed} />
      ) : (
        // <Test1 id = {props.id} onFeed ={onFeed} setOnFeed = {setOnFeed} />
        <Post id={"6406e421eecad9672affbdd0"} windowScroll={windowScroll} setOnFeed={setOnFeed} onFeed={onFeed} />

      )}
    </>
  );
}

export default Dashboard;

