import React from "react";
import Sidebar from "./Sidebar";
import MentorAvailability from "./MentorAvailability";

const appMentors = () => {
  return (
    <div className="flex">
      <div className="w-[20%]">
        <Sidebar />
      </div>

      <div className="w-[100%]">
        <MentorAvailability />
      </div>
    </div>
  );
};

export default appMentors;
