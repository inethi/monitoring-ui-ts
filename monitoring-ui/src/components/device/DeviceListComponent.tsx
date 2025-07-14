import { Device } from "@/lib/types";
import DeviceComponent from "./DeviceComponent";

const DeviceListComponent = ({ devices }: { devices: Device[] }) => {
  return (
    <div className="px-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5">
      {devices.map((device) => (
        <DeviceComponent key={device.id} device={device} />
      ))}
    </div>
  );
};

export default DeviceListComponent;
