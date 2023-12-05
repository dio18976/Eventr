const express = require('express');
const {engine} = require('express-handlebars');
const myconnection = require('express-myconnection');
const bodyParser = require('body-parser');
const multer = require('multer')
const mysql = require('mysql');
const tasksRoutes = require('./routes/pages');
const app = express();
const fs = require('node:fs');
const session = require('express-session');
const loginRoutes = require('./routes/pages');


app.set('port', 4000);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static('src'));
app.use('/images-load', express.static('images-load'));

app.set('views', __dirname+'\\..\\views\\hbs');
app.engine('.hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'eventr'
},'single'));

app.listen(app.get('port'), ()=>{
    console.log('Listening on port ',app.get('port'))
})
app.use('/', tasksRoutes);

app.get('/', (req, res)=>{
    if(req.session.loggedin == true){
        req.getConnection((err, conn)=>{
            conn.query('SELECT * FROM evento', (err, evento)=>{
                if(err){
                    res.json(err);
                }
                console.log(evento);
                res.render('home', {evento, name: req.session.name});
            });
        });
    } else{
        res.redirect('/login');
    }
})


app.use('/', loginRoutes);

//Subir imagenes

const upload = multer({dest: '/src/images'});

/*app.post('/test', upload.fields([
    {name: 'banner', maxCount: 1},
    {name: 'gallery', maxCount: 6}
]), (req,res) =>{
    saveImage(req.files['banner'][0]);
    req.files['gallery'].map(saveImage);
    res.send('Termina')
});*/

app.post('/succesfull', upload.single('banner'),(req, res)=>{
    console.log(req.file);
    saveImage(req.file);
    res.send('Termina');
});

/*app.post('/succesfull', upload.array('imagenes', 6),(req, res)=>{
    req.files.map(saveImage);
    res.send('TerminaMulti');
});*/
function saveImage(file){
    const  newPath= './images-load/'+file.originalname;
    fs.renameSync(file.path, newPath);
    console.log(newPath);
    return newPath;
}