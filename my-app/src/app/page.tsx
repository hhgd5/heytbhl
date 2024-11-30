"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Dashboard from '@/components/Render/Dashboard';
import DriverManagement from '@/components/Render/DriverManagement';
import VehicleManagement from '@/components/Render/VehicleManagement';
import MissionManagement from '@/components/Render/MissionManagement';

type Section = 'dashboard' | 'drivers' | 'vehicles' | 'missions';

const page = () => {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
  };

  const sectionTitles: Record<Section, string> = {
    dashboard: "Dashboard",
    drivers: "Drivers",
    vehicles: "Vehicles",
    missions: "Missions",
  };

  

  return (
    <div className="flex h-[100vh] bg-[#f3f4f6]">
      <div className="w-64 h-full bg-gray-900 text-white p-4">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold">TBHL Transport</h1>
        </div>
        <nav className="space-y-2">
          <button
            className={`w-full text-left p-2 rounded ${
              activeSection === "dashboard"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
            onClick={() => handleSectionChange("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`w-full text-left p-2 rounded ${
              activeSection === "drivers" ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => handleSectionChange("drivers")}
          >
            Drivers
          </button>
          <button
            className={`w-full text-left p-2 rounded ${
              activeSection === "vehicles" ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => handleSectionChange("vehicles")}
          >
            Vehicles
          </button>
          <button
            className={`w-full text-left p-2 rounded ${
              activeSection === "missions" ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
            onClick={() => handleSectionChange("missions")}
          >
            Missions
          </button>
        </nav>
      </div>

      <div className="w-full ">
        <div className="flex text-center w-full p-4 bg-white">
          <h2 className="text-black text-lg">{sectionTitles[activeSection]}</h2>
          <div className="ml-auto flex space-x-2">
            <Button variant="ghost" className="mr-2">
              Profile
            </Button>
            <Button variant="destructive">Logout</Button>
          </div>
        </div>
        <div className="flex text-center bg w-100 h-[88.8vh] p-4">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'drivers' && <DriverManagement />}
        {activeSection === 'vehicles' && <VehicleManagement />}
        {activeSection === 'missions' && <MissionManagement />}
        </div>
      </div>

      <div></div>
    </div>
  );
};

export default page;
