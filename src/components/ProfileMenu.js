import React from "react";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  return (
    <div className="menu">
      <ul>
        <li>
          <Link to="/profile/personal-information">Personal Information</Link>
        </li>
        <li>
          <Link to="/profile/my-maps">My Maps</Link>
        </li>
        <li>
          <Link to="/profile/message-center">Message Center</Link>
        </li>
        <li>
          <Link to="/sign-out">Sign Out</Link>
        </li>
      </ul>
    </div>
  );
};

export default ProfileMenu