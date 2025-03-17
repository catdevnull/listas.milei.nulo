import AdmZip from "adm-zip";

import { z } from "zod";

const LegacySchema = z.object({
  id_str: z.string(),
  screen_name: z.string(),
  name: z.string(),
  follow_request_sent: z.boolean(),
  protected: z.boolean(),
  following: z.boolean(),
  followed_by: z.boolean(),
  blocking: z.boolean(),
  profile_image_url_https: z.string(),
  verified: z.boolean(),
});

const AffiliatesHighlightedLabelSchema = z.object({});
const IdentityProfileLabelsHighlightedLabelSchema = z.object({});

const UserResultSchema = z.object({
  __typename: z.literal("User"),
  id: z.string(),
  community_role: z.enum(["Admin", "Member", "Moderator"]),
  legacy: LegacySchema,
  rest_id: z.string(),
  //   super_following: z.boolean(),
  //   super_follow_eligible: z.boolean(),
  //   super_followed_by: z.boolean(),
  //   affiliates_highlighted_label: AffiliatesHighlightedLabelSchema,
  is_blue_verified: z.boolean(),
  //   identity_profile_labels_highlighted_label: IdentityProfileLabelsHighlightedLabelSchema
});

const TwitterUserSchema = z.object({
  result: UserResultSchema,
  id: z.string(),
});

export const TwitterUsersSchema = z.array(TwitterUserSchema);

export async function loadData() {
  const zip = new AdmZip("./data.zip");
  const entries = zip.getEntries();

  return entries.map((entry) => ({
    name: entry.entryName,
    content: TwitterUsersSchema.parse(JSON.parse(entry.getData().toString())),
  }));
}
