export const base64ToUint8Array = (base64: string): Uint8Array => {
  return Uint8Array.from(window.atob(base64), (c) => c.charCodeAt(0));
};
