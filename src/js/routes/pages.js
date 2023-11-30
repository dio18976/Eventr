const express=require('express');
const Control = require('../controllersPath');

const router = express.Router();

router.get('/event', Control.event);
router.get('/form', Control.form);
router.post('/form', Control.store);
router.get('/login', Control.login);
router.post('/login', Control.auth);
router.get('/signin', Control.signin);
router.post('/signin', Control.signinForm);
router.get('/logout', Control.logout);

module.exports=router;