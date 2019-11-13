import { observable, action } from "mobx";
export class SingleNote {
  title: string;
  detail: string;
  id: number;
  timeStamp: number;
  notifId: string

  constructor(id?: number, title?: string, detail?: string, timeStamp?: number, notifId?: string) {
    this.title = title;
    this.detail = detail;
    this.id = id;
    this.timeStamp = timeStamp;
    this.notifId = notifId;
  }
}

class NoteList {
  @observable list: Array<SingleNote> = [];
  @action updateList(newList: Array<SingleNote>) {
    this.list = newList;
  }
}

var obv = new NoteList()
export default obv;