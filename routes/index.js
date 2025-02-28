var express = require('express');
var router = express.Router();
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/dashboard", (req, res) => {

  res.render("dashboard");
});
router.get("/employes", (req, res) => {

  res.render("employesList");
});
router.get("/employes/ajout", (req, res) => {

  res.render("addemployes");
});

//contact page
router.get("/contact", (req, res) => {
  res.render("contact");
});


router.get("/employes/modifier/:id", (req, res) => {

  res.render("editEmployes");

});



module.exports = router;
