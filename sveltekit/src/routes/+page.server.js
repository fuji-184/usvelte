import db from "$lib/db.js"

export const load = async ()=> {
 const res = await db`select * from users;`;
 
 return {
   users: res
 }
}