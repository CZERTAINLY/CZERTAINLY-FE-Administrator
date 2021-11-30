export function inventoryStatus(status: String) {
  switch (status) {
    case "Success":
      return ["Success", "success"];
    case "REGISTERED":
      return ["Reistered", "success"];
    case "CONNECTED":
      return ["Connected", "success"];
    case "FAILED":
      return ["Failed", "danger"];
    case "Failed":
      return ["Failed", "danger"];
    case "OFFLINE":
      return ["Offline", "danger"];
    case "WAITING_FOR_APPROVAL":
      return ["Waiting for Approval", "warning"];
    default:
      return [status || "Unknown", "dark"];
  }
}
