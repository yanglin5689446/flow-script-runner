export default function hexToBytes(hexString: string): number[] {
  const bytes = [];
  for (let c = 0; c < hexString.length; c += 2)
    bytes.push(parseInt(hexString.substr(c, 2), 16));
  return bytes;
}
