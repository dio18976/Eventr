function emailUser(){
   return emailUser='SELECT * FROM usuario WHERE correo = ?';
}
function insertUser(){
    return insertUser='INSERT INTO usuario SET ?';
 }
function insertCreater(){
    return insertCreater = 'INSERT INTO creador SET ?';
}
function insertTicket(){
    return insertTicket = 'INSERT INTO entrada SET ?';
}
function insertEvent(){
    return insertEvent = 'INSERT INTO evento SET ?';
}

module.exports={
    emailUser:emailUser,
    insertUser: insertUser,
    insertCreater: insertCreater,
    insertTicket: insertTicket,
    insertEvent: insertEvent
};