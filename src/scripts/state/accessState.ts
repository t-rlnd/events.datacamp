// Centralized accessID state for interface access control.
// Only modify accessID using setAccessID to keep state/global sync.
import { updateRadiosFromAccess } from '../ui/access/accessRadios';

let accessID = 'none'; // Current access identifier

// Accessor for current accessID
export function getAccessID() {
  return accessID;
}

// Exclusive setter which keeps radios in sync with the current accessID.
// URL persistence is intentionally not done here (only on form submit).
export function setAccessID(newAccessID: string) {
  if (accessID === newAccessID) return;
  accessID = newAccessID;
  console.log('accessID State:', accessID);
  updateRadiosFromAccess(accessID);
}
