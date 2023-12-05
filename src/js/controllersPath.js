const bcrypt = require('bcrypt');
const query = require('./query');
const fs = require('node:fs');
const { Console } = require('node:console');
const moment = require('moment');

function event(req, res){
    if(req.session.loggedin == true){
        res.render('pages/event', {name: req.session.name});
    } else{
        res.redirect('/login');
    }
}
function form(req, res){
    if(req.session.loggedin == true){
        res.render('pages/form', {email: req.session.correo});
    } else{
        res.redirect('/login');
    }
}
function upEvent(req, res){
        const data = req.body;
        const newPathBanner = './images-load/'+(data.nombre+req.files['banner'][0].originalname);
        const valuesCreater = {nombre: data.nombre, tipo: data.tipo};
        
        let emailUser=req.session.correo;
        let idUser;


        fs.renameSync(req.files['banner'][0].path, newPathBanner);
        console.log(req.files['banner'][0]);

        console.log(req.session);
        req.getConnection((err, conn)=>{
            conn.query(query.insertCreater(), [valuesCreater], (err, result)=>{
                if (err) throw err;
                console.log('Successfully upload table creater');

                conn.query(query.emailUser(), emailUser, (err, userdata)=>{
                    if(userdata.length > 0){
                        userdata.forEach(element =>{
                            idUser=element.idUsuario;
                            console.log(idUser);
                        });
                    }
                });
                const valuesEvent={idCreador: result.insertId, nombreEvento: data.nombreEvento, descripcion: data.descripcionEvento, fecha: data.fecha, hora: data.hora, banner:newPathBanner, ubicacion:data.ubicacion, requisitose:data.requisitose, enlaces: data.enlaces};

                conn.query(query.insertEvent(), [valuesEvent], (err, result)=>{
                    if (err) throw err;
                    console.log('Successfully upload table event');

                    const valuesTicket = {idEvento: result.insertId,idUsuario: idUser, precio: data.precio, cantidad: data.cantidad};
                    //const valuesTicket = [[result.insertId, idUser ,data.precio, data.cantidad]]; 
                
                    conn.query(query.insertTicket(), [valuesTicket], (err, rows)=>{
                        if (err) throw err;
                        console.log('Successfully upload table tickets');
                    });
 
                    req.files['gallery'].forEach(file => {
                        const newPathGallery = './images-load/'+(data.nombre+'_'+file.originalname);
                        fs.renameSync(file.path, newPathGallery);
                        console.log(file);
                        const valuesGallery = {idEvento: result.insertId, picPath: newPathGallery};
                        // Save the path to the database
                        conn.query("INSERT INTO gallery SET ?", [valuesGallery], function (err, result) {
                            if (err) throw err;
                            console.log("1 record inserted");
                        }); 
                    });
                });
            });
        });
        

        //console.log(data);
        res.redirect('/form'); 
     
}
function login(req,res){
    if(req.session.loggedin != true){
        res.render('pages/login');
    } else{
        res.redirect('/');
    }
}

function auth(req, res){
    const data = req.body;
    req.getConnection((err, conn)=>{
        conn.query(query.emailUser(), [data.correo], (err, userdata)=>{
            if(userdata.length > 0){
                userdata.forEach(element =>{
                    bcrypt.compare(data.contrasena, element.contrasena, (err, isMatch)=>{
                    
                        if(!isMatch){
                            res.render('pages/login', {error: 'Error: Contraseña invalida !'});
                        }else{
                            req.session.loggedin = true;
                            req.session.name = element.nombre; 
                            req.session.correo = data.correo;
                            res.redirect('/');
                        }
                    });
                })
            } else{
                res.render('pages/login', {error: 'Error: Usuario no existente'});
            }
        });
    });
}
function signin(req,res){
    if(req.session.loggedin != true){
        res.render('pages/signin');
    } else{
        res.redirect('/');
    }
    res.render('pages/signin')
}
function signinForm(req,res){
    const data = req.body;
    req.getConnection((err, conn)=>{
        conn.query(query.emailUser(), [data.correo], (err, userdata)=>{
            if(userdata.length > 0){
                res.render('pages/signin', {error: 'Error: Usuario existente'});
            } else{
                bcrypt.hash(data.contrasena, 12).then(hash =>{
                    data.contrasena = hash;
                    req.getConnection((err, conn)=>{
                        conn.query(query.insertUser(), [data], (err,rows)=>{
                            req.session.loggedin = true;
                            req.session.name = data.nombre; 
                            req.session.email = data.correo;
                            res.redirect('/');
                        })
                    });
                })
            }
        })
    })
}

function saveImage(file, data){ 
    const newPath = './images-load/'+data.nombre+'/'+file.originalname;
    fs.renameSync(file.path, newPath);
    return newPath;
}

function logout(req,res){
    if(req.session.loggedin == true){
        req.session.destroy();
    }
        res.redirect('/login');
}

function eventBd(req, res){
    if(req.session.loggedin == true){
        const id = req.params.idEvento;
        req.getConnection((err, conn)=>{
            conn.query('SELECT * FROM evento WHERE idEvento = ?', id, (err, event)=>{
                const dating = new Date(event[0].fecha);
                const onlyDate = dating.toISOString().substring(0,10);
                const day = dating.getDate();
                const month = dating.getMonth();
                const year = dating.getFullYear();
                const weekDay = dating.getDay();
                const allMonths = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                const abrMonths = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
                const monthText = allMonths[month];
                const abrMthText = abrMonths[month];
                const time = event[0].hora;
                const hourMin = moment(time, 'HH:mm:ss').format('HH:mm');
                const pathBanner = event[0].banner;
                const pathBannerW= pathBanner.replace(/ /g, "\\ ");


                if(err){
                    res.json(err);
                }
                conn.query('SELECT * FROM gallery WHERE idEvento = ?', id, (err, gallery)=>{
                    if(err){
                        res.json(err);
                    }
                    res.render('pages/eventBd', {name: req.session.name, event, day: day, month: monthText, abrMont: abrMthText ,year: year, date: onlyDate, weekDay: weekDay, time: hourMin, gallery, pathBanner: pathBannerW});
                })
            }); 
        });

    } else{
        res.redirect('/login');
    }
}

function searching(req, res){
    const eventName = '%' + req.body.searchEvent + '%';
    req.getConnection((err, conn)=>{
        conn.query('SELECT * FROM evento WHERE nombreEvento LIKE ?', eventName, (err, events)=>{
            if (err) throw err;
            console.log(req.session.name);
            res.render('pages/searchEvents', {events, eventName, name: req.session.name})
        })
    })
}
module.exports={
    event: event,
    form: form,
    upEvent: upEvent,
    login: login,
    auth: auth,
    signin:signin,
    signinForm: signinForm,
    logout,
    eventBd: eventBd,
    searching: searching
}