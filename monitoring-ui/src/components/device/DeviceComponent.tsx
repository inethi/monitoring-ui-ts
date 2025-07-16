import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Device } from "@/lib/types";

// Function to translate device_type
function translateDeviceType(type: string) {
  if (type === "access_point") return "Access Point";
  if (type === "dns_server") return "Domain Name Server";
  if (!type) return "";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

interface DeviceComponentProps {
  device: Device;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
}

const DeviceComponent = ({
  device,
  onEdit,
  onDelete,
}: DeviceComponentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{device.name}</CardTitle>
        <CardDescription>{device.ip_address}</CardDescription>
        <CardAction>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onEdit(device)}
            >
              <Pencil />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(device)}
            >
              <Trash />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Device Type: {translateDeviceType(device.device_type)}</p>
        <p>Mac Address: {device.mac_address}</p>
      </CardContent>
    </Card>
  );
};

export default DeviceComponent;
