import {
  useState
} from "react";

import api
from "../api/axios";

function TravelPlans() {

  const [destination,
          setDestination]
    = useState("");

  const [startDate,
          setStartDate]
    = useState("");

  const [endDate,
          setEndDate]
    = useState("");

  const [budget,
          setBudget]
    = useState("");

  const [travelStyle,
          setTravelStyle]
    = useState("");

  const createPlan =
    async () => {

      try {

        await api.post(
          "/api/travel-plans",
          {
            destination,
            startDate,
            endDate,
            budget,
            travelStyle
          }
        );

        alert(
          "Travel Plan Created"
        );

      } catch(error) {

        alert(
          "Failed"
        );
      }
    };

  return (

    <div>

      <h2>
        Create Travel Plan
      </h2>

      <input
        placeholder="Destination"
        onChange={(e)=>
          setDestination(
            e.target.value
          )
        }
      />

      <br />

      <input
        type="date"
        onChange={(e)=>
          setStartDate(
            e.target.value
          )
        }
      />

      <br />

      <input
        type="date"
        onChange={(e)=>
          setEndDate(
            e.target.value
          )
        }
      />

      <br />

      <input
        placeholder="Budget"
        onChange={(e)=>
          setBudget(
            e.target.value
          )
        }
      />

      <br />

      <input
        placeholder="Travel Style"
        onChange={(e)=>
          setTravelStyle(
            e.target.value
          )
        }
      />

      <br />

      <button
        onClick={
          createPlan
        }
      >
        Create
      </button>

    </div>
  );
}

export default TravelPlans;