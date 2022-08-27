import EpnsSDK from "@epnsproject/backend-sdk-staging";

const CHANNEL_PK = process.env.NEXT_PUBLIC_EPNS_WALLET_PK || "";

const epnsSdk = new EpnsSDK(CHANNEL_PK);

interface EpnsData {
  recipientAddress: Array<string> | string;
  pushNotificationtitle: string;
  pushNotificationMessage: string;
  notificationTitle: string;
  notificationMessage: string;
  cta: string | undefined;
  img: string | undefined;
}
export async function sendEPNS(data: EpnsData) {
  if (typeof data.recipientAddress == "string") {
    const tx = await epnsSdk.sendNotification(
      data.recipientAddress,
      data.pushNotificationtitle,
      data.pushNotificationMessage,
      data.notificationTitle,
      data.notificationMessage,
      3, //this is the notificationType
      data.cta, // a url for users to be redirected to
      data.img, // an image url, or an empty string
      null //this can be left as null
    );
  } else {
    data.recipientAddress.forEach(async (addr) => {
      const tx = await epnsSdk.sendNotification(
        addr,
        data.pushNotificationtitle,
        data.pushNotificationMessage,
        data.notificationTitle,
        data.notificationMessage,
        3, //this is the notificationType
        data.cta, // a url for users to be redirected to
        data.img, // an image url, or an empty string
        null //this can be left as null
      );
    });
  }
}
