import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNum: "",
    brand: "",
    model: "",
    purchaseDate: "",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehicles");
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleDialogToggle = () => setIsDialogOpen(!isDialogOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVehicle = async () => {
    try {
      const response = await fetch("http://localhost:3000/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNumber: newVehicle.registrationNum,  // Change this line
          brand: newVehicle.brand,
          model: newVehicle.model,
          purchaseDate: newVehicle.purchaseDate,
        }),
      });
  
      if (response.ok) {
        const addedVehicle = await response.json();
        setVehicles((prev) => [...prev, addedVehicle]);
        setNewVehicle({
          registrationNum: "",
          brand: "",
          model: "",
          purchaseDate: "",
        });
        handleDialogToggle(); 
      } 
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };
  

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vehicle Management</h2>
        <Button onClick={handleDialogToggle}>Add New Vehicle</Button>
      </div>

      <Card>
        <CardContent
          className={vehicles.length > 6 ? "overflow-y-scroll max-h-[400px]" : ""}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left border">Registration</th>
                  <th className="p-3 text-left border">Brand</th>
                  <th className="p-3 text-left border">Model</th>
                  <th className="p-3 text-left border">Purchase Date</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{vehicle.registrationNum}</td>
                    <td className="p-3 border">{vehicle.brand}</td>
                    <td className="p-3 border">{vehicle.model}</td>
                    <td className="p-3 border">{vehicle.purchaseDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="registrationNum"
              placeholder="Registration Number"
              value={newVehicle.registrationNum}
              onChange={handleInputChange}
            />
            <Input
              name="brand"
              placeholder="Brand"
              value={newVehicle.brand}
              onChange={handleInputChange}
            />
            <Input
              name="model"
              placeholder="Model"
              value={newVehicle.model}
              onChange={handleInputChange}
            />
            <Input
              name="purchaseDate"
              type="date"
              placeholder="Purchase Date"
              value={newVehicle.purchaseDate}
              onChange={handleInputChange}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleDialogToggle}>
              Cancel
            </Button>
            <Button onClick={handleAddVehicle}>Add Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleManagement;
