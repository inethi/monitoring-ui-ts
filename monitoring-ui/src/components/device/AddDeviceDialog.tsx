import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDevice } from "@/lib/deviceEndpoints";
import { Device, Network } from "@/lib/types";
import { fetchNetworks } from "@/lib/networkEndpoints";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddDeviceDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [deviceType, setDeviceType] =
    useState<Device["device_type"]>("unknown");
  const [network, setNetwork] = useState<number | null>(null);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch networks on mount
  useEffect(() => {
    setError(null);
    async function fetchData() {
      try {
        const res = await fetchNetworks();
        setNetworks(res);
        if (res.length > 0) setNetwork(res[0].id);
      } catch (err: any) {
        console.error("[AddDeviceDialog] fetchData error:", err);
        setError("Failed to load networks");
      }
    }
    if (open) fetchData();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!network) throw new Error("Please select a network");
      const payload = {
        name: name || null,
        ip_address: ipAddress,
        mac_address: macAddress || null,
        device_type: deviceType,
        network: network,
      };
      await createDevice(payload);
      {
        /* TODO: Add sonner toast */
      }
      toast("Device created", {
        description: `Device '${name || ipAddress}' was added successfully.`,
      });

      setName("");
      setIpAddress("");
      setMacAddress("");
      setDeviceType("unknown");
      setNetwork(networks.length > 0 ? networks[0].id : null);
      setOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to add device");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-900 text-white hover:bg-green-600">
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new device to your network.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="device-name">Name</Label>
            <Input
              id="device-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Device Name"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="ip-address">IP Address</Label>
            <Input
              id="ip-address"
              name="ip_address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="e.g. 192.168.1.10"
              required
              type="text"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="mac-address">MAC Address</Label>
            <Input
              id="mac-address"
              name="mac_address"
              value={macAddress}
              onChange={(e) => setMacAddress(e.target.value)}
              placeholder="e.g. AA:BB:CC:DD:EE:FF (optional)"
              type="text"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="device-type">Device Type</Label>
            <Select
              value={deviceType}
              onValueChange={(val) =>
                setDeviceType(val as Device["device_type"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Device Types</SelectLabel>
                  <SelectItem value="unknown">Unknown</SelectItem>
                  <SelectItem value="dns_server">DNS Server</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="firewall">Firewall</SelectItem>
                  <SelectItem value="access_point">Access Point</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="network">Network</Label>
            <Select
              value={network !== null ? String(network) : undefined}
              onValueChange={(val) => setNetwork(Number(val))}
              disabled={networks.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent className="bg-background bg-opacity-100">
                <SelectGroup>
                  <SelectLabel>Networks</SelectLabel>
                  {networks.map((n) => (
                    <SelectItem key={n.id} value={String(n.id)}>
                      {n.name || `Network ${n.id}`}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            {/* TODO: Add loading button */}
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
