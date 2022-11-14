import { channels } from "@epnsproject/frontend-sdk-staging";
import { Signer } from "./types";

export async function subscribeEpns(signer: Signer, accountAddress: string) {
  const channelAddress = "0xb8CD57fA4e1e1CBC4E5fB961b5f551987d1e34cc";

  //get channel basic info
  const details = await channels.getChannelByAddress(channelAddress);

  //check if user is subscribed to channel
  const isSubscribed = channels.isUserSubscribed(
    accountAddress,
    channelAddress
  );

  //opt into a channel
  channels.optIn(
    signer,
    channelAddress,
    80001, //channel Id
    accountAddress,
    {
      onSuccess: () => {}, // do something after a successfull subscription, like bring up a modal or a notification
    }
  );

  // //opt out of a channel
  // channels.optOut(
  //   signer,
  //   channelAddress,
  //   chainId,
  //   userAccount,
  //   {
  //     onSuccess: () =>  // do something after a successfull unsubscription, like bring up a modal or a notification
  //   }
  // );
}
