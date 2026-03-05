import { createContext, useContext, useEffect, useState } from "react";

const EventsContext = createContext(); // gebruik van context en - provider

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  //haalt events op van server

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const eventsRes = await fetch("http://localhost:3000/events");
        const categoriesRes = await fetch("http://localhost:3000/categories");

        if (!eventsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const eventsData = await eventsRes.json();
        const categoriesData = await categoriesRes.json();

        setEvents(eventsData ?? []);
        setCategories(categoriesData ?? []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addEvent = async (newEvent) => {
    // Event toevoegen 'add event feature aan de back end
    try {
      const res = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) {
        throw new Error("Failed to create event");
      }

      const saved = await res.json();

      setEvents((prev) => [...prev, saved]);

      return saved;
    } catch (error) {
      console.error("Add error:", error);
      throw error;
    }
  };

  const updateEvent = async (updatedEvent) => {
    // Event edit knop
    try {
      const res = await fetch(
        `http://localhost:3000/events/${updatedEvent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update event");
      }

      const saved = await res.json();

      setEvents((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));

      return saved;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  const deleteEvent = async (id) => {
    // Delete knop
    try {
      const res = await fetch(`http://localhost:3000/events/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        categories,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
