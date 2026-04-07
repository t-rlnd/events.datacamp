// Centralized accessID state for interface access control.
// Only modify accessID using setAccessID to keep state/global sync.
import { updateRadiosFromAccess } from '../ui/accessRadios';
import { updateURLFromAccess } from '../users/access';

let accessID = 'none'; // Current access identifier

// Accessor for current accessID
export function getAccessID() {
  return accessID;
}

// Exclusive setter which triggers global sync (URL & radios)
export function setAccessID(newAccessID: string) {
  if (accessID === newAccessID) return;
  accessID = newAccessID;
  console.log('accessID State:', accessID);
  updateURLFromAccess(accessID);
  updateRadiosFromAccess(accessID);
}
