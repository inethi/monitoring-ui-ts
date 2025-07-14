"use client";
import DeviceListComponent from "@/components/device/DeviceListComponent";
import { AddDeviceDialog } from "@/components/device/AddDeviceDialog";
import { getDevices } from "@/lib/deviceEndpoints";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await getDevices();
      setDevices(devices);
    };
    fetchDevices();
  }, []);
  return (
    <div>
      <div className="flex items-center justify-between mb-6 px-8">
        <h1 className="text-2xl font-bold">Devices</h1>
        <AddDeviceDialog />
      </div>
      <div className="flex flex-col gap-4">
        <DeviceListComponent devices={devices} />
      </div>
    </div>
  );
};

export default Dashboard;
