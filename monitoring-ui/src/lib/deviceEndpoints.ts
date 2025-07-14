export async function getDevices() {
  const useBackend = process.env.NEXT_PUBLIC_BACKEND !== "false";
  if (useBackend) {
    // Replace with your actual backend API endpoint
    const res = await fetch("/api/devices");
    return res.json();
  } else {
    // Import local JSON data
    const data = await import("../../_data/devices.json");
    return data.default;
  }
}
