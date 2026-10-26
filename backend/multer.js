const multer=require("multer");
const path=require("path");

// storage congiguration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/') // Destination Folder for storing files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname); // unique filename
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

// File filter to only accept images
const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image/")) cb(null,true);
    else cb(new Error("Only Images are Allowed"),false);
}

const upload = multer({ 
    storage: storage,
    fileFilter:fileFilter,
})

module.exports=upload;