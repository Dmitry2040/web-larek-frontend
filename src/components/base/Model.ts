import { IEvents } from "./Events";

export const isModel = (obj: unknown): obj is Model<any> => {
  return obj instanceof Model;
}

export abstract class Model<T> {
  constructor(data: Partial<T>, protected events: IEvents) {
    Object.assign(this, data);
  }

  // Сообщить, что модель изменилась
  emitChanges(event: string, payload?: object) {
    this.events.emit(event, payload ?? {});
  }
}