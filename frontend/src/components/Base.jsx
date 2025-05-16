import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import HP from "./homepage";
import Joinpage from "./Joinpage";
import CP from "./createpage";

const Base = () => {
  console.log("not working");

  let router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <HP />
        </div>
      ),
    },
    {
      path: "/Join",
      element: (
        <div>
          <Joinpage />
        </div>
      ),
    },
    {
      path: "/Create",
      element: (
        <div>
          <CP />
        </div>
      ),
    },
  ]);
  return <div>{<RouterProvider router={router} />}</div>;
};

export default Base;
