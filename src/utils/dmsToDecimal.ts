/**
 * Converts a DMS (Degrees Minutes Seconds) coordinate string to a Decimal Degrees tuple.
 * Expected input format: "39 44 39.3 N 37 00 60.0 E"
 */
export function parseDmsToDecimal(dmsString: string): [number, number] | null {
  if (!dmsString) return null;

  const parts = dmsString.trim().split(/\s+/);
  if (parts.length < 8) return null;

  try {
    const latDeg = parseFloat(parts[0]);
    const latMin = parseFloat(parts[1]);
    const latSec = parseFloat(parts[2]);
    const latDir = parts[3].toUpperCase();

    const lngDeg = parseFloat(parts[4]);
    const lngMin = parseFloat(parts[5]);
    const lngSec = parseFloat(parts[6]);
    const lngDir = parts[7].toUpperCase();

    let lat = latDeg + latMin / 60 + latSec / 3600;
    if (latDir === "S") lat = -lat;

    let lng = lngDeg + lngMin / 60 + lngSec / 3600;
    if (lngDir === "W") lng = -lng;

    return [lat, lng];
  } catch (e) {
    console.error("Failed to parse DMS:", dmsString);
    return null;
  }
}
