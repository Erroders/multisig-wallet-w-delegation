const { default: Resolution } = require("@unstoppabledomains/resolution");
const resolution = new Resolution();

export function resolveUD(domain: string, currency: "ETH" | "ZIL") {
  resolution
    .addr(domain, currency)
    .then((address: string) => console.log(domain, "resolves to", address))
    .catch(console.error);
}

export function reverseResolveUD(address: string) {
  resolution
    .reverse(address, { location: "UNSLayer2" })
    .then((domain: string) => console.log(address, "reversed to url", domain))
    .catch(console.error);
}
