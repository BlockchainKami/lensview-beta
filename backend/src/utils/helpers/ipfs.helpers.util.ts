import { Web3Storage, File } from "web3.storage";
import { PUBLIC_WEB3STORAGE_TOKEN } from "../../config/env.config";

if (!PUBLIC_WEB3STORAGE_TOKEN) {
  throw new Error(
    "Must define PUBLIC_WEB3STORAGE_TOKEN in the .env to run this"
  );
}

/**
 * Creates a new instance of the StorageClient class.
 *
 * @return {Web3Storage} A new instance of the StorageClient class.
 */
function makeStorageClient() {
  return new Web3Storage({ token: PUBLIC_WEB3STORAGE_TOKEN });
}

/**
 * Creates File objects from binary data.
 *
 * @param {string} data - The binary data used to create the File objects.
 * @return {File[]} An array of File objects created from the binary data.
 */
function makeFileObjects(data: string) {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const blob = new Blob([data], {
    type: "application/json"
  });

  return [
    new File(["contents-of-file-1"], "plain-utf8.txt"),
    new File([blob] as [BlobPart], "metaData.json")
  ];
}

/**
 * Uploads a file to IPFS and returns the URI of the uploaded file.
 *
 * @param {string} data - The data to be uploaded to IPFS.
 * @return {string} The URI of the uploaded file.
 */
export const uploadIpfs = async (data: string) => {
  const client = makeStorageClient();
  const cid = await client.put(makeFileObjects(data));
  console.log("stored files with cid:", cid);
  const uri = `https://${cid}.ipfs.w3s.link/metaData.json`;

  console.log("URI : " + uri);
  return uri;
};