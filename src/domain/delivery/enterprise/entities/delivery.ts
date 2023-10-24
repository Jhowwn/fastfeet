import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import dayjs from "dayjs";
import { DeliveryAttachmentList } from "./delivery-attachments-list";

type DeliveryStatus = "Aguardando" | "Retirada" | "Entregue" | "Devolvida";

export interface DeliveryProps {
  title: string;
  description: string;
  recipientId: UniqueEntityID;
  courierId: UniqueEntityID;
  latitude: number;
  longitude: number;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt?: Date | null;
  attachments: DeliveryAttachmentList;
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  get recipientId() {
    return this.props.recipientId;
  }

  get courierId() {
    return this.props.courierId;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  get status() {
    return this.props.status;
  }

  set status(status: DeliveryStatus) {
    this.props.status = status;
    this.touch();
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: DeliveryAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt, "days") <= 3;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<DeliveryProps, "createdAt" | "attachments">,
    id?: UniqueEntityID,
  ) {
    const delivery = new Delivery(
      {
        ...props,
        attachments: props.attachments ?? new DeliveryAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
        status: props.status,
      },
      id,
    );

    return delivery;
  }
}
