import React, { useState, useEffect } from "react";

import Post from "../component/post";

function Dashboard(props) {
  const [windowScroll, setWindowScroll] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setWindowScroll(window.scrollY);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Post id={props.id} windowScroll={windowScroll} />
    </>
  );
}

export default Dashboard;

