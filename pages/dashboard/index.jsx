import React, { useState, useEffect } from "react";
import { storageRef } from "../../base";
import Router from "next/router";


import Post from "../component/post";

function Dashboard(props) {
  
  return (
    <>
        <Post id={props.id} />
    </>
  );
}

export default Dashboard;
