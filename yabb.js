const tesseract = require("node-tesseract-ocr")
 
const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
}
 
tesseract.recognize("image2.png", config)
  .then(text => {
    console.log("Result:", text)
  })
  .catch(error => {
    console.log(error.message)
  })