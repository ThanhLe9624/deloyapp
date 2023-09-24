var express = require('express');
var router = express.Router();

const CustomerModel = require('../models/customer_model');

const multer = require('multer');
const { response } = require('../app');

const myStorage = multer.diskStorage({
  destination: (req, d, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    // cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    cb(null, `${file.fieldname}-${Date.now()}.jpg`);
  },
});

const upload = multer({storage: myStorage});

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let custs = await CustomerModel.find();
  return res.render('customer/index', {customers: custs});
});

router.get('/create', (req, res) => {
  return res.render('customer/create');
});

router.post('/create', upload.single('image'), async (req, res) => {
  let body = req.body;
  let file = req.file;
  let cust = new CustomerModel({
    fullname: body.fullname,
    email: body.email,
    password: body.password,
    image: file.filename
  });
  await cust.save();
  return res.redirect('/customer');
});

//Search
router.get('/search', async (req, res) => {
  let name = req.query.fullname;
  let result = await CustomerModel.find({fullname: new RegExp(name)});
  return res.render('customer/index', {customers: result});
});

//Update
router.get('/update/:id', async (req, res) => {
  let id = req.params.id;
  let result = await CustomerModel.findById(id);
  return res.render('customer/update', {customer: result});
});

router.post('/update/:id', upload.single('image'), async (req, res) => {
  let id = req.params.id;
  let result = await CustomerModel.findById(id);

  let body = req.body;
  let file = req.file;

  result.fullname = body.fullname;
  result.email = body.email;

  if (body.password != undefined && body.password.length > 0) {
    result.password = body.password;
  }
  if (file != undefined) {
    result.image = file.filename;
  }

  await result.save();
  return res.redirect('/customer');
});

module.exports = router;
