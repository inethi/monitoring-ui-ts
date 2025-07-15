"use client";
import DeviceListComponent from "@/components/device/DeviceListComponent";
import { AddDeviceDialog } from "@/components/device/AddDeviceDialog";
import { fetchDevices } from "@/lib/deviceEndpoints";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { Device } from "@/lib/types";
import { fetchNetworks } from "@/lib/networkEndpoints";
import CreateNetworkForm from "@/components/ui/CreateNetworkForm";
import { Network } from "@/lib/types";

const Dashboard = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [networksLoading, setNetworksLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        setNetworksLoading(true);
        const [devices, networks] = await Promise.all([
          fetchDevices(),
          fetchNetworks(),
        ]);
        setDevices(devices);
        setNetworks(networks);
        setNetworksLoading(false);
      };
      fetchData();
      setFadeIn(true);
    }
  }, [isAuthenticated]);

  const handleNetworkCreated = async () => {
    setNetworksLoading(true);
    const networks = await fetchNetworks();
    setNetworks(networks);
    setNetworksLoading(false);
  };

  if (loading || networksLoading) return null;
  if (!isAuthenticated) return null;

  if (networks.length === 0) {
    return (
      <div
        className={`transition-opacity duration-500 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <h1 className="text-2xl font-bold mb-4">Create a Network</h1>
          <CreateNetworkForm onCreated={handleNetworkCreated} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
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
