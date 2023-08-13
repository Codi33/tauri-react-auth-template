import { useState } from "react";
// import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import { fetch, Body } from "@tauri-apps/api/http";

// 2ecea63f11758f4d4acdbc4ee20c42df3d71d61f

type Response = {
  token: string;
};

function Login() {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const login = async (e: any) => {
    e.preventDefault();

    fetch<Response>("http://localhost:8000/auth/login/", {
      method: "POST",
      timeout: 10,
      body: Body.json({
        username: user,
        password: pass,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (
          signIn({
            token: res.data.token,
            expiresIn: 60 * 24, // 24 hours
            authState: { username: "me" },
            tokenType: "Token",
          })
        ) {
          navigate("/", {
            state: { msg: `Successfully logged in as me` },
          });
        }
      })
      .catch(() => {
        alert("Something went wrong");
      });
    // invoke("login", { username: user, password: pass })
    //   .then((value) => {
    //     if (
    //       signIn({
    //         token: "123",
    //         authState: { username: value },
    //         expiresIn: 10,
    //         tokenType: "Bearer",
    //       })
    //     ) {
    //       navigate("/", {
    //         state: { msg: `Successfully logged in as ${value}` },
    //       });
    //     }

    //     console.log(`success: ${value}`);
    //   })
    //   .catch((error) => {
    //     console.error(`error: ${error}`);
    //   });
  };

  return (
    <form onSubmit={login}>
      <input
        type="text"
        value={user}
        onChange={(e) => {
          setUser(e.target.value);
        }}
      />
      <input
        type="password"
        value={pass}
        onChange={(e) => {
          setPass(e.target.value);
        }}
      />
      <input type="submit" />
    </form>
  );
}

export default Login;
