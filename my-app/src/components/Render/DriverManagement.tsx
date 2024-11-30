import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

const DriverManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]); // Driver array
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);

  const [newDriver, setNewDriver] = useState<Omit<Driver, "id">>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch("http://localhost:3000/drivers");
        const data = await response.json();
        console.log(data)
        if (Array.isArray(data)) {
          setDrivers(data);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    }

    fetchDrivers();
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewDriver((prevState) => ({ 
      ...prevState, 
      [id === 'phone' ? 'phoneNumber' : id]: value 
    }));
  };

  const addDriver = async () => {
    try {
      const response = await fetch("http://localhost:3000/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDriver),
      });

      if (!response.ok) {
        throw new Error("Failed to add driver");
      }

      const addedDriver: Driver = await response.json();
      setDrivers((prevDrivers) => [...prevDrivers, addedDriver]);
      setIsDriverModalOpen(false);
      setNewDriver({ firstName: "", lastName: "", phoneNumber: "", email: "" });
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Driver Management</h2>
        <Dialog open={isDriverModalOpen} onOpenChange={setIsDriverModalOpen}>
          <DialogTrigger asChild>
            <Button>Add New Driver</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={newDriver.firstName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={newDriver.lastName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phoneNumber"
                  value={newDriver.phoneNumber}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newDriver.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <Button type="button" className="w-full" onClick={addDriver}>
                Save Driver
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className={drivers.length > 6 ? "overflow-y-scroll max-h-[400px]" : ""}>
          <div className="overflow-x-auto ">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left border">ID</th>
                  <th className="p-3 text-left border">First Name</th>
                  <th className="p-3 text-left border">Last Name</th>
                  <th className="p-3 text-left border">Phone</th>
                  <th className="p-3 text-left border">Email</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{driver.id}</td>
                    <td className="p-3 border">{driver.firstName}</td>
                    <td className="p-3 border">{driver.lastName}</td>
                    <td className="p-3 border">{driver.phoneNumber}</td>
                    <td className="p-3 border">{driver.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverManagement;
