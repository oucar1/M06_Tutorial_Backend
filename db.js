const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://oucar1:yyWcF2bSQdSlKL7V@cluster0.pca8k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true }
);

module.exports = mongoose;
