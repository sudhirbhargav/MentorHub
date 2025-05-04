import React from "react";
import Sidebar from "./Sidebar";
import BookSession from "./BookSession";

const appMentee = () => {
  return (
    <div className="flex">
      <div className="w-[20%]">
        <Sidebar />
      </div>

      <div className="w-[100%]">
        <BookSession />
      </div>
    </div>
  );
};

export default appMentee;
