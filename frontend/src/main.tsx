import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import PersonsPage from "./pages/persons/persons";
import personManagePage from "./pages/persons/manage/personsManage";
import ManagePersonForm from "./components/person/ManagePersonForm";

const container = document.getElementById("root");

const root = createRoot(container!);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout will be loaded here
    children: [
      {
        index: true, // Default route for the root path
        element: (
          <div>
            <h1>Hello World</h1>
            <Link to="persons">Persons</Link>
          </div>
        ),
      },
      {
        path: "persons",
        Component: PersonsPage,
      },
      {
        path: "persons/manage",
        Component: ManagePersonForm,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <App />
  </React.StrictMode>
);
