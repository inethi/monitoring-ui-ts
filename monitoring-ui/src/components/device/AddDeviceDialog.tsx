import { useState, useEffect } from "react";
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
import ButtonLoading from "@/components/ui/ButtonLoading";
import { toast } from "sonner";

interface AddDeviceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDeviceAdded: () => void | Promise<void>;
}

function isValidIp(ip: string) {
  // IPv4 regex
  return /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/.test(
    ip
  );
}

function isValidMac(mac: string) {
  // MAC address regex (accepts : or -)
  return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
}

export function AddDeviceDialog({
  open,
  setOpen,
  onDeviceAdded,
}: AddDeviceDialogProps) {
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

    if (!isValidIp(ipAddress)) {
      setError("Please enter a valid IPv4 address (e.g. 192.168.1.1)");
      return;
    }
    if (macAddress && !isValidMac(macAddress)) {
      setError("Please enter a valid MAC address (e.g. AA:BB:CC:DD:EE:FF)");
      return;
    }

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
      setOpen(false); // Close dialog first
      toast.success(`Device '${name || ipAddress}' was added successfully.`, {
        action: { label: "Close", onClick: () => {} },
        richColors: true,
      });
      if (onDeviceAdded) await onDeviceAdded();
      // reset form fields
      setName("");
      setIpAddress("");
      setMacAddress("");
      setDeviceType("unknown");
      setNetwork(networks.length > 0 ? networks[0].id : null);
    } catch (err: any) {
      setError(err?.message || "Failed to add device");
      toast.error(err?.message || "Failed to add device", {
        action: { label: "Close", onClick: () => {} },
        richColors: true,
      });
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
              value={network !== null ? String(network) : ""}
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
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={() => {
                if (!loading) setOpen(false);
              }}
            >
              Cancel
            </Button>
            {loading ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" disabled={loading}>
                Save changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
