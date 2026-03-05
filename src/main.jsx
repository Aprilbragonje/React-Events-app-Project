import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { EventsPage } from "./pages/EventsPage";
import { EventPage } from "./pages/EventPage";
import { ContactPage } from "./pages/ContactPage"; // extra contact page.

import { Provider } from "./components/ui/provider";
import { Root } from "./components/Root";
import { EventsProvider } from "./context/EventsContext";
import { Toaster } from "./components/ui/toaster";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <EventsPage />,
      },
      {
        path: "events/:id",
        element: <EventPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider>
      <EventsProvider>
        <RouterProvider router={router} />
        <Toaster />
      </EventsProvider>
    </Provider>
  </React.StrictMode>,
);
