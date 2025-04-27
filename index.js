const express = require('express'); 
// const { generateJWT } = require('./utils/jwt');
// const AuthMiddleware = require('./middlwares/auth');
const app = express();
require('dotenv').config();
const userRoutes = require('./routes/UsrRoutes');


const PORT = process.env.PORT ; 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use('/api', userRoutes);

app.listen(PORT , () => console.log(`Server is running on port ${PORT}`));