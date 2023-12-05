const express=require('express');
const Control = require('../controllersPath');
const multer = require('multer');

const upload = multer({dest: 'images-load/'});

const router = express.Router();

router.get('/event', Control.event);
router.get('/form', Control.form);
router.post('/form', upload.fields([
    {name: 'banner', maxCount: 1},
    {name: 'gallery', maxCount: 6}
]), Control.upEvent);
router.get('/login', Control.login);
router.post('/login', Control.auth);
router.get('/signin', Control.signin);
router.post('/signin', Control.signinForm);
router.get('/logout', Control.logout);
router.get('/event/:idEvento', Control.eventBd);
router.post('/', Control.searching);

module.exports=router;