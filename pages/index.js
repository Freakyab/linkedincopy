import React, { useState } from "react";
import LoginPage from "./loginPage";
import Dashboard from "./dashboard/index";

function Home() {
  const [user, setUser] = useState(true);
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
