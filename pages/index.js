import React, { useState } from "react";
import LoginPage from "./loginPage";
import Dashboard from "./Dashboard/index";

function Home() {
  const [user, setUser] = useState(false);
  const [id, setId] = useState(null);

  return (
    <>
      {user ? (
        <Dashboard id={id} />
      ) : (
        <LoginPage setUser={setUser} setId={setId} />
      )}
    </>
  );
}

export default Home;
