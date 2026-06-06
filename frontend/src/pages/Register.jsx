import { useState } from "react";
import api from "../api/axios";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const register = async () => {

    try {

      const response =
        await api.post(
          "/api/auth/register",
          {
            name,
            email,
            password
          }
        );

      alert(
  JSON.stringify(response.data)
);

    } catch (error) {

      alert("Registration Failed");
    }
  };

  return (

    <div>

      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) =>
          setName(e.target.value)}
      />

      <br />

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)}
      />

      <br />

      <button onClick={register}>
        Register
      </button>

    </div>
  );
}

export default Register;