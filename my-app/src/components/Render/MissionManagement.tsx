import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const MissionManagement: React.FC = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]); 
  const [vehicles, setVehicles] = useState<any[]>([]); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMission, setNewMission] = useState({
    date: "",
    startTime: "",
    endTime: "",
    vehicle: "",
    driver: "", 
  });
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/missions");
        const data = await response.json();
        setMissions(data);
      } catch (error) {
        setError("Error fetching missions");
        console.error("Error fetching missions:", error);
      } finally {
        setLoading(false);
      }
    };


    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/drivers");
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        setError("Error fetching drivers");
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/vehicles");
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        setError("Error fetching vehicles");
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
    fetchDrivers();
    fetchVehicles();
  }, []);

  const handleDialogToggle = () => setIsDialogOpen(!isDialogOpen);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewMission((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMission = async () => {
    try {
      const response = await fetch("http://localhost:3000/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMission),
      });

      if (!response.ok) {
        throw new Error("Failed to add mission");
      }

      const addedMission = await response.json();
      setMissions((prev) => [...prev, addedMission]);

      setNewMission({
        date: "",
        startTime: "",
        endTime: "",
        vehicle: "",
        driver: "", 
      });
      handleDialogToggle();
    } catch (error) {
      setError("Error adding mission");
      console.error("Error adding mission:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mission Management</h2>
        <Button onClick={handleDialogToggle}>Schedule New Mission</Button>
      </div>

    
      {error && <div className="text-red-500">{error}</div>}

      
      <Card>
        <CardContent
          className={
            missions.length > 6 ? "overflow-y-scroll max-h-[400px]" : ""
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left border">Date</th>
                  <th className="p-3 text-left border">Start Time</th>
                  <th className="p-3 text-left border">End Time</th>
                  <th className="p-3 text-left border">Vehicle</th>
                  <th className="p-3 text-left border">Driver</th>
                </tr>
              </thead>
              <tbody>
                {missions.map((mission) => {
                  const vehicle = vehicles.find(
                    (v) => v.id === mission.vehicleId
                  );
                  const driver = drivers.find((d) => d.id === mission.driverId);
                  return (
                    <tr key={mission.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{mission.date}</td>
                      <td className="p-3 border">{mission.startTime}</td>
                      <td className="p-3 border">{mission.endTime}</td>
                      <td className="p-3 border">
                        {vehicle ? vehicle.brand : "Unknown"}
                      </td>
                      <td className="p-3 border">
                        {driver
                          ? `${driver.firstName} ${driver.lastName}`
                          : "Unknown"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {loading && <div>Loading...</div>}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Mission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="date"
              type="date"
              placeholder="Mission Date"
              value={newMission.date}
              onChange={handleInputChange}
            />
            <Input
              name="startTime"
              type="time"
              placeholder="Start Time"
              value={newMission.startTime}
              onChange={handleInputChange}
            />
            <Input
              name="endTime"
              type="time"
              placeholder="End Time"
              value={newMission.endTime}
              onChange={handleInputChange}
            />
            <select
              name="vehicle"
              value={newMission.vehicle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand}
                </option>
              ))}
            </select>
            <select
              name="driver"
              value={newMission.driver}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.firstName} {driver.lastName}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleDialogToggle}>
              Cancel
            </Button>
            <Button onClick={handleAddMission}>Add Mission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MissionManagement;
