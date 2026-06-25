import multer from "multer";

const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename : function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
}); 


export const upload = multer({ storage });

// Memory storage for KYC — we need the buffer for face-api processing
export const kycUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});