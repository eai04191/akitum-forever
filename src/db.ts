import { Status } from "masto";
import Datastore from "nedb-promises";

export type Log = {
    stripedContent: string;
} & Status;

const db = Datastore.create("data/aki.db");

export const put = async (log: Log) => {
    await db.update({ id: log.id }, log, { upsert: true });
};

export const get = async (id: string): Promise<Log | null> => {
    return await db.findOne({ id: id });
};
