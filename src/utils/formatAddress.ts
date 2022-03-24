export const formatAddress = (address: string | undefined): string => {
  if (!address) {
    return "";
  }
  const splitted = address.split("");
  splitted.splice(6, address.length - 10, "...");
  return splitted.join("");
};
