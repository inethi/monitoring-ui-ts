export type Device = {
  id: number;
  name: string | null;
  ip_address: string;
  mac_address: string | null;
  user: number | null;
  device_type:
    | "unknown"
    | "dns_server"
    | "server"
    | "firewall"
    | "access_point"
    | "switch";
  network: number | null;
  cloud_pk: number | null;
};

export type Network = {
  id: number;
  name: string | null;
  admin: number;
  created_at: string;
  cloud_pk: number | null;
};
