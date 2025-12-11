const dotenv = require("dotenv"); // This is to keep secured data
dotenv.config()
// const app = express(); // For creating the express application instance.
const app = require("./src/app")

const PORT = process.env.PORT || 5000
app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`)
})