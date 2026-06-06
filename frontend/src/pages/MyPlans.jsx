import { useEffect, useState } from "react";
import api from "../api/axios";

function MyPlans() {

  const [plans, setPlans] =
    useState([]);

  useEffect(() => {

    fetchPlans();

  }, []);

  const fetchPlans =
    async () => {

      try {

        const response =
          await api.get(
            "/api/travel-plans/my-plans"
          );

        setPlans(
          response.data
        );

      } catch(error) {

        console.log(error);
      }
    };

  return (

    <div>

      <h1>
        My Travel Plans
      </h1>

      {plans.length === 0 ? (

        <p>
          No travel plans found
        </p>

      ) : (

        plans.map((plan) => (

          <div
            key={plan.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >

            <h3>
              {plan.destination}
            </h3>

            <p>
              Start:
              {plan.startDate}
            </p>

            <p>
              End:
              {plan.endDate}
            </p>

            <p>
              Budget:
              ₹{plan.budget}
            </p>

            <p>
              Style:
              {plan.travelStyle}
            </p>

          </div>

        ))

      )}

    </div>
  );
}

export default MyPlans;