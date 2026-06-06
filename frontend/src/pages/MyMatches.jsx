import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link }
from "react-router-dom";


function MyMatches() {

  const [matches, setMatches] =
    useState([]);

  useEffect(() => {

    loadMatches();

  }, []);

  const loadMatches =
    async () => {

      const response =
        await api.get(
          "/api/matches"
        );

      setMatches(
        response.data
      );
    };

  return (

    <div>

      <h1>
        My Matches
      </h1>

      {matches.map((match) => (

        <div
          key={match.matchId}
        >

          <h3>
            {match.name}
          </h3>

          <p>
            {match.email}
          </p>

          <p>
            {match.status}
          </p>
<Link
  to={`/chat/${match.userId}`}
>
  Open Chat
</Link>
        </div>

      ))}

    </div>
  );
}

export default MyMatches;