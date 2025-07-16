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
import { toast } from "sonner";
import { updateDevice, deleteDevice } from "@/lib/deviceEndpoints";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/ui/ButtonLoading";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [networksLoading, setNetworksLoading] = useState(true);

  // Toast and dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    ip_address: "",
    mac_address: "",
    device_type: "",
  });
  const [editError, setEditError] = useState<string | null>(null);

  function isValidIp(ip: string) {
    return /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/.test(
      ip
    );
  }
  function isValidMac(mac: string) {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
  }

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

  // Callback to refresh devices after add/edit/delete
  const refreshDevices = async () => {
    const devices = await fetchDevices();
    setDevices(devices);
  };

  // Handlers for edit
  const handleEditClick = (device: Device) => {
    setSelectedDevice(device);
    setEditForm({
      name: device.name || "",
      ip_address: device.ip_address || "",
      mac_address: device.mac_address || "",
      device_type: device.device_type || "unknown",
    });
    setEditError(null);
    setEditDialogOpen(true);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    setEditError(null);
    if (!isValidIp(editForm.ip_address)) {
      setEditError("Please enter a valid IPv4 address (e.g. 192.168.1.1)");
      return;
    }
    if (editForm.mac_address && !isValidMac(editForm.mac_address)) {
      setEditError("Please enter a valid MAC address (e.g. AA:BB:CC:DD:EE:FF)");
      return;
    }
    setEditLoading(true);
    try {
      await updateDevice(selectedDevice.id, editForm);
      toast.success("Device updated successfully.", {
        action: { label: "Close", onClick: () => {} },
        richColors: true,
      });
      setEditDialogOpen(false);
      setEditError(null);
      await refreshDevices();
    } catch (err: any) {
      console.log("[handleEditSubmit] err", err);
      // Try to extract backend validation errors
      const macError =
        err?.response?.data?.mac_address?.[0] || err?.mac_address?.[0]; // fallback if structure is different

      if (macError && macError.includes("already exists")) {
        setEditError(
          "The MAC address provided is already assigned to another device."
        );
        toast.error(
          "The MAC address provided is already assigned to another device.",
          {
            action: { label: "Close", onClick: () => {} },
            richColors: true,
          }
        );
        // Do not close the dialog, let the user fix the error
      } else {
        toast.error(err?.message || "Failed to update device", {
          action: { label: "Close", onClick: () => {} },
          richColors: true,
        });
        setEditDialogOpen(false);
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Handlers for delete
  const handleDeleteClick = (device: Device) => {
    setSelectedDevice(device);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedDevice) return;
    setDeleteLoading(true);
    try {
      await deleteDevice(selectedDevice.id);
      toast.success("Device deleted successfully.", {
        action: { label: "Close", onClick: () => {} },
        richColors: true,
      });
      setDeleteDialogOpen(false);
      await refreshDevices();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete device", {
        action: { label: "Close", onClick: () => {} },
        richColors: true,
      });
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
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
          <CreateNetworkForm
            onCreated={handleNetworkCreated}
            onToast={({ type, message }) => {
              if (type === "success") {
                toast.success(message, {
                  action: { label: "Close", onClick: () => {} },
                  richColors: true,
                });
              } else {
                toast.error(message, {
                  action: { label: "Close", onClick: () => {} },
                  richColors: true,
                });
              }
            }}
          />
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
        <AddDeviceDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          onDeviceAdded={refreshDevices}
        />
      </div>
      <div className="flex flex-col gap-4">
        <DeviceListComponent
          devices={devices}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>
      {/* Edit Device Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              placeholder="Device Name"
              required
            />
            <Input
              name="ip_address"
              value={editForm.ip_address}
              onChange={handleEditChange}
              placeholder="IP Address"
              required
            />
            <Input
              name="mac_address"
              value={editForm.mac_address}
              onChange={handleEditChange}
              placeholder="MAC Address"
            />
            {/* Device Type Dropdown */}
            <div>
              <label className="block mb-1 font-medium">Device Type</label>
              <Select
                value={editForm.device_type}
                onValueChange={(val) =>
                  setEditForm((f) => ({ ...f, device_type: val }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Device Types</SelectLabel>
                    <SelectItem value="unknown">Unknown</SelectItem>
                    <SelectItem value="dns_server">DNS</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="firewall">Firewall</SelectItem>
                    <SelectItem value="access_point">Access Point</SelectItem>
                    <SelectItem value="switch">Switch</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {editError && (
              <div className="text-red-600 text-sm">{editError}</div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditDialogOpen(false)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              {editLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit">Save Changes</Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Device Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Device</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this device?</p>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            {deleteLoading ? (
              <ButtonLoading />
            ) : (
              <Button
                type="submit"
                className="btn btn-destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
