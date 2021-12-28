var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer  =   require('multer');
var fs = require('fs')
var crypto = require('crypto');
var multipart = require('connect-multiparty');
const path = require('path');
var multipartMiddleware = multipart();
/* GET home page. */

router.get('/browser', function(req, res, next) {
  var rootdir = req.param('fordername');
  console.log(rootdir);
  const images_dir = fs.readdirSync('public/uploads');
  var sorted = [];
  var listfd =[];
  if(rootdir){
    const images1 = fs.readdirSync('public/uploads/'+rootdir);
    for (let item of images1){
      if(item.split('.').pop() === 'png'
      || item.split('.').pop() === 'jpg'
      || item.split('.').pop() === 'JPG'
      || item.split('.').pop() === 'PNG'
      || item.split('.').pop() === 'JPEG'
      || item.split('.').pop() === 'jpeg'
      || item.split('.').pop() === 'svg'){
        
            var abc = {
                "image" : "/uploads/"+rootdir+'/'+item,
                "folder" : '/'
            };
            sorted.push(abc);
       
        
      }else{
         
      }
    }
  }
  else{
    const images = fs.readdirSync('public/uploads');
    for (let item of images){
      if(item.split('.').pop() === 'png'
      || item.split('.').pop() === 'jpg'
      || item.split('.').pop() === 'JPG'
      || item.split('.').pop() === 'PNG'
      || item.split('.').pop() === 'JPEG'
      || item.split('.').pop() === 'jpeg'
      || item.split('.').pop() === 'svg'){
          var abc = {
                "image" : "/uploads/"+item,
                "folder" : '/'
          };
          sorted.push(abc);
        
      }else{
         
      }
    }
  }
  for (let item of images_dir){
      if(item.split('.').pop() === 'png'
      || item.split('.').pop() === 'jpg'
      || item.split('.').pop() === 'JPG'
      || item.split('.').pop() === 'PNG'
      || item.split('.').pop() === 'JPEG'
      || item.split('.').pop() === 'jpeg'
      || item.split('.').pop() === 'svg'){
         
      }else{
          var fdlists = {
                "folder" : item
          };
          listfd.push(fdlists);
      }
  }
  //res.send(sorted);
  
  res.render('filemanager/browser',{listimages:sorted,listforders:listfd,rootfolder:rootdir,layout: 'filemanager'});
});
router.get('/getallfolder', function(req, res, next) {
  const directoryPath = path.join('public/uploads');
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      files.forEach(function (file) {
        if (fs.statSync(directoryPath +'/'+ file).isDirectory()) {
          console.log(file); 
        }
        else {
          //filelist.push(file);
        }
          // Do whatever you want to do with the file
          
      });
  });
});
router.post('/uploadimage', multipartMiddleware,function(req, res) {
  var rootdir = req.param('folder','/');
  fs.readFile(req.files.file.path, function (err, data) {
    var imageName = req.files.file.name
    
    // If there's an error
    if(!imageName){
      res.redirect('back');
    } else {
      var newPath=__basedir+"/public/uploads/"+rootdir+'/'+imageName;
      // write file to uploads/fullsize folder
      fs.writeFile(newPath, data, function (err) {
        // let's see it
        res.redirect('back');
        //res.redirect("/public/uploads/" + imageName);
      });
    }
  });
});
//delete file
router.post('/deleteimages', function(req, res, next){
  var url_del = 'public/' + req.body.url_del
  console.log(url_del)
  if(fs.existsSync(url_del)){
    fs.unlinkSync(url_del)
  }
  res.redirect('back')
});
router.post('/createfolder', function(req, res, next){
  var rootdir = req.param('foldername','Newfolder');
  var dir =__basedir+"/public/uploads/"+rootdir
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  res.redirect('back')
});


module.exports = router;
