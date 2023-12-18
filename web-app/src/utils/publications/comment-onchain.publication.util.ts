import { uploadIpfs } from "../ipfs.util";
import type {
  CreateOnchainCommentBroadcastItemResult,
  OnchainCommentRequest
} from "../../gql/graphql";
import createOnchainCommentTypedDataLensService from "../../services/lens/create-onchain-comment-typed-data.lens.service";
import { signedTypeData } from "../ethers.util";
import broadcastOnchainRequestLensService from "../../services/lens/broadcast-onchain-request.lens.service";
import { waitUntilBroadcastTransactionIsComplete } from "../transaction/wait-until-complete.transaction.util";
import type { RelayError, RelaySuccess } from "../../gql/graphql";
import { MetadataAttributeType, textOnly } from "@lens-protocol/metadata";
import { profileUserStore } from "../../stores/user/profile.user.store";
const { VITE_SOURCE_APP_ID } = import.meta.env;

const commentOnChainPublicationUtil = async (
  parentPubId: string,
  comment: string
) => {
  let handle = "";
  const unsub = profileUserStore.subscribe((_profile) => {
    if (_profile === null) return;
    handle = _profile?.handle?.fullHandle;
  });
  unsub();

  const metadata = textOnly({
    locale: "en-US",
    tags: ["0f89daeb0a63c7b73224315c5514c21ba0453985"], //userHash
    appId: VITE_SOURCE_APP_ID,
    attributes: [
      {
        key: "creator",
        type: MetadataAttributeType.STRING,
        value: handle
      },
      {
        key: "app",
        type: MetadataAttributeType.STRING,
        value: VITE_SOURCE_APP_ID
      },
      {
        key: "created on",
        type: MetadataAttributeType.STRING,
        value: Date.now().toString()
      }
    ],
    content: comment
    //TODO: Check for below fields usage
    // encryptedWith: PublicationMetadataLitEncryption,
    // hideFromFeed: false,
  });

  const ipfsResultUri = await uploadIpfs(JSON.stringify(metadata));
  console.log("post onchain: ipfs result uri", ipfsResultUri);

  const request: OnchainCommentRequest = {
    commentOn: parentPubId,
    contentURI: ipfsResultUri
    // you can play around with open actions modules here all request
    // objects are in `publication-open-action-options.ts`
    // openActionModules: [simpleCollectAmountAndLimit(address)],
    //
    // you can play around with reference modules here
    // all request objects are in `publication-reference-module-options.ts`,
    // referenceModule: referenceModuleFollowOnly,
  };

  const { id, typedData } = (await createOnchainCommentTypedDataLensService(
    request
  )) as CreateOnchainCommentBroadcastItemResult;
  console.log("comment onchain: result", { id, typedData });

  console.log("comment onchain: typedData", typedData);

  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value
  );
  console.log("comment onchain: signature", signature);

  // if (USE_GASLESS) {
  const broadcastResult = (await broadcastOnchainRequestLensService({
    id,
    signature
  })) as RelaySuccess | RelayError;

  await waitUntilBroadcastTransactionIsComplete(broadcastResult, "Comment");
  // } else {
  //   const { v, r, s } = splitSignature(signature);
  //
  //   const tx = await lensHub.commentWithSig(
  //     {
  //       profileId: typedData.value.profileId,
  //       contentURI: typedData.value.contentURI,
  //       pointedProfileId: typedData.value.pointedProfileId,
  //       pointedPubId: typedData.value.pointedPubId,
  //       referrerProfileIds: typedData.value.referrerProfileIds,
  //       referrerPubIds: typedData.value.referrerPubIds,
  //       referenceModuleData: typedData.value.referenceModuleData,
  //       actionModules: typedData.value.actionModules,
  //       actionModulesInitDatas: typedData.value.actionModulesInitDatas,
  //       referenceModule: typedData.value.referenceModule,
  //       referenceModuleInitData: typedData.value.referenceModuleInitData
  //     },
  //     {
  //       signer: address,
  //       v,
  //       r,
  //       s,
  //       deadline: typedData.value.deadline
  //     },
  //     { gasLimit: 10000000 }
  //   );
  //   console.log("comment onchain: tx hash", tx.hash);
  // }
};

export default commentOnChainPublicationUtil;
