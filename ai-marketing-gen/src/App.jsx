import React, { useState } from "react";
import "./App.css";
import SideBar from "./components/SideBar";
import ChatInterface from "./components/ChatInterface";

function App() {
  return (
    <>
      <div className="flex h-screen bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100">
        {/* <SideBar /> */}
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    </>
  );
}

export default App;
