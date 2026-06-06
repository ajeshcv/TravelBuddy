import { useEffect, useState } from "react";
import api from "../api/axios";

function FindMatches() {

  const [matches, setMatches] =
    useState([]);

  useEffect(() => {

    fetchMatches();

  }, []);

  const fetchMatches =
    async () => {

      try {

        const response =
          await api.get(
            "/api/travel-plans/matches"
          );

        setMatches(
          response.data
        );

      } catch(error) {

        console.log(error);
      }
    };

  const sendRequest =
    async (userId) => {

      try {

        const response =
          await api.post(
            "/api/matches/request",
            {
              receiverId: userId
            }
          );

        alert(
          response.data
        );

      } catch(error) {

        alert(
          "Failed"
        );
      }
    };

  return (

    <div>

      <h1>
        Find Travel Buddies
      </h1>

      {matches.length === 0 ? (

        <p>
          No Matches Found
        </p>

      ) : (

        matches.map((match) => (

          <div
            key={match.userId}
            style={{
              border: "1px solid gray",
              marginBottom: "10px",
              padding: "15px",
              borderRadius: "8px"
            }}
          >

            <h3>
              {match.travelerName}
            </h3>

            <p>
              Destination:
              {match.destination}
            </p>

            <p>
              Match:
              {match.matchPercentage}%
            </p>

            <button
              onClick={() =>
                sendRequest(
                  match.userId
                )
              }
            >
              ❤️ Interested
            </button>

          </div>

        ))

      )}

    </div>
  );
}

export default FindMatches;