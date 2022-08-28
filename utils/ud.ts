import {
  default as Resolution,
  UnsLocation,
} from "@unstoppabledomains/resolution";
const resolution = new Resolution();

export async function resolveUD(domain: string, currency: "ETH" | "ZIL") {
  const address = await resolution.addr(domain, currency);
  return address;
  // .then((address: string) => console.log(domain, "resolves to", address))
  // .catch(console.error);
}

export async function reverseResolveUD(
  address: string
): Promise<string | null> {
  const domain = await resolution.reverse(address, {
    location: UnsLocation.Layer2,
  });
  return domain;

  // .then((domain: string) => console.log(address, "reversed to url", domain))
  // .catch(console.error);
}
