import { Device } from "@/lib/types";
import DeviceComponent from "./DeviceComponent";
import { Info } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

const DeviceListComponent = ({ devices }: { devices: Device[] }) => {
  if (!devices || devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100px] w-full">
        <div className="w-full max-w-xl">
          <Alert>
            <Info />
            <AlertTitle>
              No devices found. Please add a device to get started.
            </AlertTitle>
          </Alert>
        </div>
      </div>
    );
  }
  return (
    <div className="px-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5">
      {devices.map((device) => (
        <DeviceComponent key={device.id} device={device} />
      ))}
    </div>
  );
};

export default DeviceListComponent;
