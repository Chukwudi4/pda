import * as database from "expo-sqlite";
import obsv from './manager';
import { SingleNote } from "./manager";
export class Db {
    dbMan
    constructor(){
        this.dbMan = database.openDatabase("pda.db");
        this.createTable()
    }

    updateNote(columns: string, condition: string, nav: Function){
        console.log(`update notes set ${columns} where ${condition}`)
        this.dbMan.transaction(tx => {
            tx.executeSql(
              `update notes set ${columns} where ${condition}`,
              [],
              (_, success) => {console.warn(_); nav()},
              (_, error) => {
                console.log(error.message);
                alert(error.message)
                nav()
                return true;
              }
            );
          });
    }

    addColumn(){
      this.dbMan.transaction(tx => {
        tx.executeSql(
          "alter table notes add column notifId number",[],
          (_, success) => {console.warn("alteration successfully")},
          (_, error) => {
            console.log(error.message);
            return true;
          }
        );
      });
    }

  newNote(note: SingleNote, nav: Function) {

    this.dbMan.transaction(tx => {
      tx.executeSql(
        "insert into notes (title, detail, timestamp, notifId ) values (?, ?, ?, ?)",
        [note.title, note.detail, note.timeStamp, note.notifId],
        (_, success) => {console.warn("inserted successfully"); nav()},
        (_, error) => {
          console.log(error.message);
          alert(error.message)
          nav()
          return true;
        }
      );
    });
  }

  async viewNotes() {
    this.dbMan.transaction(tx => {
      tx.executeSql(
        "select * from notes", 
        null, 
        (_, { rows }) => {console.log(rows._array),obsv.updateList(rows._array)},
        (_, error)=> {
            console.log(error.message)
            return true
        }
      );
    });
  }

  createTable() {
    this.dbMan.transaction(tx => {
      tx.executeSql(
          `create table if not exists notes (id integer primary key autoincrement, title text, detail text);`,
          null, 
        (_, { rows }) => console.log(''),
        (_, error)=> {
            console.log(error.message)
            return true
        }
        );
    });
  }

  deleteRecord(id: number, nav: Function) {
    console.warn(id)
    this.dbMan.transaction(tx => {
      tx.executeSql(
          `delete from notes where id = ?`,
          [id], 
        (_, { rows, rowsAffected }) => {nav(), console.warn(rows), console.warn(rowsAffected)},
        (_, error)=> {
            console.warn(error.message)
            return true
        }
        );
    });
  }
}
