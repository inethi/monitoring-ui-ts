"use client";
import DeviceListComponent from "@/components/device/DeviceListComponent";
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
      <DeviceListComponent devices={devices} />
    </div>
  );
};

export default Dashboard;
