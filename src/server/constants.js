import md5 from "md5";

const currentDate = new Date();

const year = currentDate.getUTCFullYear();
const month = currentDate.getUTCMonth() + 1;
const day = currentDate.getUTCDate();

const timestamp = `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;


export const BASE_URL = 'http://api.valantis.store:40000/';
export const xAuth = md5(`Valantis_${timestamp}`);
