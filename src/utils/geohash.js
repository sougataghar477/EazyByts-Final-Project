import Geohash from "latlon-geohash";

// Encode latitude/longitude → geohash
export function encodeGeohash(lat, lon, precision = 7) {
  return Geohash.encode(lat, lon, precision);
}