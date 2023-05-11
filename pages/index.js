import React, { useState } from "react";
import LoginPage from "./loginPage";
import Dashboard from "./dashboard/index";

function Home() {
  const [user, setUser] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  return (
    <>
      {user ? (
        <Dashboard id={id} name={name} />
      ) : (
        <LoginPage setUser={setUser} setId={setId} setName={setName} />
      )}
    </>
  );
}

export default Home;
