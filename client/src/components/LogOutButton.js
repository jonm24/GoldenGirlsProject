import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <div onClick={logout} style={{marginLeft: '10px', marginTop: '3px'}}>
      <img alt="logout icon" src="https://img.icons8.com/ios/25/000000/exit.png"/>
    </div>
  );
};

export default LogoutButton;
