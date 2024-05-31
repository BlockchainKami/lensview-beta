import clientAxiosUtil from "../../utils/axios/client.axios.util";
import type { AxiosResponse } from "axios";
import type { UrlValidateResponseAppModel } from "../../models/app/responses/url-validate.response.app.model";

const getPublicationIdAppService = async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    console.log("tab : ", tab);

    if (!tab || !tab?.url) {
      throw new Error("tab not found");
    }
    console.log("tab?.url : ", typeof tab?.url);
    console.log("tab?.url : ", tab?.url);

    return await clientAxiosUtil
      .get("url/validate", {
        params: {
          search_query: tab?.url
        }
      })
      .then(
        (
          resp: AxiosResponse<UrlValidateResponseAppModel>
        ): string | undefined => {
          return resp.data?.publicationID;
        }
      );
  } catch (err) {
    // TODO: Handle error as mentioned in this article
    // https://www.builder.io/blog/safe-data-fetching
    console.log("getRelatedPostPubIdsAppService err:", err);
    throw err;
  }
};

export default getPublicationIdAppService;
