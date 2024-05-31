import { getTextOnlyCommentsOnPublicationLensService } from "../../services/lens/get-text-only-comments-on-publication.lens.service";

export const isNewCommentAddedSinceLastUpdateHelperUtil = async (
  currentCommentCount: number,
  publicationId: string
): Promise<boolean> => {
  const textOnlyComments =
    await getTextOnlyCommentsOnPublicationLensService(publicationId);
  return textOnlyComments.items.length > currentCommentCount;
};
