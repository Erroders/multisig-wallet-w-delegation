import { resolveUD, reverseResolveUD } from "./ud";

export async function getUdName(address: string) {
  let res = null;

  if (!address.includes(".")) {
    res = await reverseResolveUD(address);
  }

  if (res == null) {
    res = address;
  }

  return res;
}

export async function getAddress(domain: string) {
  let res = null;

  if (domain.includes(".")) {
    if (domain.split(".")[1] == "zil") {
      res = await resolveUD(domain.split(".")[0], "ZIL");
    } else {
      res = await resolveUD(domain.split(".")[0], "ETH");
    }
  }

  if (res == null) {
    res = domain;
  }

  return res;
}
