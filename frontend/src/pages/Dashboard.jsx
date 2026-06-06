import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Dashboard() {

  const [user, setUser] =
    useState(null);

  const navigate =
    useNavigate();

  useEffect(() => {

    fetchUser();

  }, []);

  const fetchUser =
    async () => {

      try {

        const response =
          await api.get(
            "/api/users/me"
          );

        setUser(
          response.data
        );

      } catch(error) {

        console.log(error);
      }
    };

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  };

  if(!user) {

    return <h2>Loading...</h2>;
  }

  return (

    <div>

      <h1>
        Travel Buddy Dashboard
      </h1>

      <h2>
        Welcome {user.name}
      </h2>

      <p>
        Email: {user.email}
      </p>

      <br />

      <br />

<Link to="/travel-plans">
  Create Travel Plan
</Link>

<br /><br />

<Link to="/my-plans">
  View My Plans
</Link>


<br /><br />

<Link
  to="/find-matches"
>
  Find Travel Buddies
</Link>
<Link to="/chats">
    Chats
</Link>

<Link
  to="/my-matches"
>
  My Matches
</Link>
      <br />
      <br />

      <button
        onClick={logout}
      >
        Logout
      </button>

    </div>
  );
}

export default Dashboard;