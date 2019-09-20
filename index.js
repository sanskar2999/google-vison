let express = require ('express')
let vision = require('@google-cloud/vision')
let app =express()
let upload=require('express-fileupload')
app.set('view engine','ejs')
app.use(upload())
app.use(express.static("images"))
let client = new vision.ImageAnnotatorClient()
//client.labelDetection('1.jpg').then(function(data){
    //console.log(data)
    app.get('/',function(req,res){
        res.render('index')
      })
//})
//,{data:data[0].labelAnnotations}
app.post("/",function(req,res){
     if(req.files){
       let file=req.files.image
       let filename=file.name
       let mode= req.body.mode
       file.mv("./images/"+filename).then(function(){
           if(mode=="label")
           {
            client.labelDetection("./images/"+filename).then(function(data){
                res.render('resultLabel',{data:data[0].labelAnnotations,name:filename})
              })
           }
           else if(mode=="text")
            {
            client.textDetection("./images/"+filename).then(function(data){
                res.render('resulttext',{data:data[0].fullTextAnnotation.text,name:filename})
              })
           }
           else if(mode=="face")
           {
              client.faceDetection("./images/"+filename).then(function(data){
             res.render('resultface',{data:data[0].faceAnnotations,name:filename})
           })
        }
         })
    }
     else {
         res.send("UPDLOAD FILE")
     }

}
)
console.log('hey')
app.listen(5000,function(){
    console.log("server is runing")
})
