const getPictureURLUtil = (fetchedLensURL: string, ownedByAddress: string) => {
  console.log("fetchedLensURL", typeof fetchedLensURL);
  if (
    fetchedLensURL === "" ||
    fetchedLensURL === undefined ||
    fetchedLensURL.includes("ipfs")
  ) {
    return `https://cdn.stamp.fyi/avatar/eth:${ownedByAddress}?s=300`;
  } else {
    return fetchedLensURL;
  }
};

export default getPictureURLUtil;
