"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EventList from "@/src/components/Dashboard/EventiList";
import CreateEditEvent from "@/src/components/Dashboard/CreateEditEvent";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const EventsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeComponent, setActiveComponent] = useState("list");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setActiveComponent("create");
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setActiveComponent("create");
  };

  const handleBackToList = () => {
    setActiveComponent("list");
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestione Eventi</h1>
        <p className="text-gray-600">
          Crea e gestisci gli eventi e i relativi contenuti
        </p>
      </div>

      <div className="space-y-6">
        {activeComponent === "list" && (
          <EventList
            onNewEvent={handleNewEvent}
            onEditEvent={handleEditEvent}
          />
        )}

        {activeComponent === "create" && (
          <CreateEditEvent
            existingEvent={selectedEvent}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
};

export default EventsPage;
