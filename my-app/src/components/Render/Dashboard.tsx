import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Users, Car, Calendar } from "lucide-react";

const Dashboard: React.FC = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [missions, setMissions] = useState([]);

  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://localhost:3000/drivers");
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      } else {
        console.error("Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("http://localhost:3000/vehicles");
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      } else {
        console.error("Failed to fetch vehicles");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const fetchMissions = async () => {
    try {
      const response = await fetch("http://localhost:3000/missions");
      if (response.ok) {
        const data = await response.json();
        setMissions(data);
      } else {
        console.error("Failed to fetch missions");
      }
    } catch (error) {
      console.error("Error fetching missions:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
    fetchMissions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        TBHL Transport Management Dashboard
      </h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="w-10 h-10 mr-4 text-blue-600" />
            <div>
              <CardTitle>Total Drivers</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {drivers.length}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Car className="w-10 h-10 mr-4 text-green-600" />
            <div>
              <CardTitle>Total Vehicles</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {vehicles.length}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="w-10 h-10 mr-4 text-purple-600" />
            <div>
              <CardTitle>Active Missions</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {missions.length}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
