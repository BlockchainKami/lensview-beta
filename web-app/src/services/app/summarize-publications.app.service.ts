import clientAxiosUtil from "../../utils/axios/client.axios.util";
import type { AxiosResponse } from "axios";
import type { CommentSummarizeResponseAppModel } from "../../models/app/responses/comment-summarize.response.app.model";

const summarizePublicationsAppService = async (mainPubId: string) => {
  console.log("summarizePublicationsAppService mainPubId:", mainPubId);

  try {
    return await clientAxiosUtil
      .get("comment/summarize", {
        params: {
          pubId: mainPubId
        }
      })
      .then(
        (
          resp: AxiosResponse<CommentSummarizeResponseAppModel>
        ): CommentSummarizeResponseAppModel => {
          return resp.data;
        }
      );
  } catch (err) {
    // TODO: Handle error as mentioned in this article
    // https://www.builder.io/blog/safe-data-fetching
    console.log("summarizePublicationsAppService err:", err);
    throw err;
  }
};

export default summarizePublicationsAppService;
