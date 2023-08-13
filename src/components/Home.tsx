import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { useAuthHeader, useAuthUser, useSignOut } from "react-auth-kit";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetch } from "@tauri-apps/api/http";

type Payload = {
  message: string;
};

interface Subscription {
  end_date: string;
  id: string;
}

interface Subscriptions extends Array<Subscription> {}

function Home() {
  const { state } = useLocation();
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const logout = useSignOut();

  const [status, setStatus] = useState("");
  const [subscriptions, setSubscriptions] = useState<Subscriptions>();
  const [loading, setLoading] = useState(true);

  // let subscriptions: Subscription[] = [];

  const get_subs = async () => {
    const res = await fetch<Subscriptions>("http://localhost:8000/subs/", {
      method: "GET",
      headers: {
        Authorization: authHeader(),
      },
    });
    // console.log(await res.json());
    // subscriptions = res.data;
    setSubscriptions(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (state && state.msg) {
      toast(state.msg, {
        theme: "colored",
        type: "success",
        position: "bottom-right",
      });
      window.history.replaceState(null, "");
    }

    listen<Payload>("setstatus", (event) => {
      // console.log("status ${}");
      setStatus(`Status: ${event.payload.message}`);
    });

    get_subs();
  }, [location]);

  const check = async () => {
    invoke("check", { procName: "Notepad" })
      .then(() => {
        // setStatus(`process id: ${value}`);
        toast("Successfully injected", {
          type: "success",
          theme: "colored",
          position: "bottom-right",
        });
      })
      .catch((error) => {
        setStatus(`Error! ${error}`);
      });
  };

  return (
    <>
      Hello {auth()?.username} <br />
      {status} <br />
      {!loading ? subscriptions?.at(0)?.end_date : <h1>Loading</h1>}
      <button onClick={logout}>Logout</button>
      <button onClick={check}>Check</button>
      <ToastContainer />
    </>
  );
}

export default Home;
