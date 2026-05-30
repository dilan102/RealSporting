export type PublishStatus = "draft" | "published";

export function resolvePublishStatus(item: {
  status?: PublishStatus;
}): PublishStatus {
  if (item.status === "draft" || item.status === "published") {
    return item.status;
  }

  return "published";
}

export function isPublishedEntry(item: {
  status?: PublishStatus;
}): boolean {
  return resolvePublishStatus(item) === "published";
}
