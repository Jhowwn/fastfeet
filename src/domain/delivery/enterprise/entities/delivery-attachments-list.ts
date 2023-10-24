import { WatchedList } from "@/core/entities/watched-list";
import { DeliveryAttachment } from "./delivery-attachment";

export class DeliveryAttachmentList extends WatchedList<DeliveryAttachment> {
  compareItems(a: DeliveryAttachment, b: DeliveryAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId);
  }
}
