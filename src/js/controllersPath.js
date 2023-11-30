const bcrypt = require('bcrypt');

function event(req, res){
    if(req.session.loggedin == true){
        res.render('pages/event', {name: req.session.name});
    } else{
        res.render('pages/event');
    }
}
function form(req, res){
    res.render('pages/form')
}
function store( req, res){
    console.log(req.body);
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
        conn.query('SELECT * FROM usuario WHERE correo = ?', [data.correo], (err, userdata)=>{
            if(userdata.length > 0){
                userdata.forEach(element =>{
                    bcrypt.compare(data.contrasena, element.contrasena, (err, isMatch)=>{
                    
                        if(!isMatch){
                            res.render('pages/login', {error: 'Error: Contraseña invalida !'});
                        }else{
                            req.session.loggedin = true;
                            req.session.name = element.nombre;
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
        conn.query('SELECT * FROM usuario WHERE correo = ?', [data.correo], (err, userdata)=>{
            if(userdata.length > 0){
                res.render('pages/signin', {error: 'Error: Usuario existente'});
            } else{
                bcrypt.hash(data.contrasena, 12).then(hash =>{
                    data.contrasena = hash;
                    req.getConnection((err, conn)=>{
                        conn.query('INSERT INTO usuario SET ?', [data], (err,rows)=>{
                            //console.log(data);
                            req.session.loggedin = true;
                            req.session.name = data.nombre;
                            res.redirect('/');
                        })
                    });
                })
            }
        })
    })
}

function logout(req,res){
    if(req.session.loggedin == true){
        req.session.destroy();
    }
        res.redirect('/login');
}

module.exports={
    event: event,
    form: form,
    store: store,
    login: login,
    auth: auth,
    signin:signin,
    signinForm: signinForm,
    logout
}