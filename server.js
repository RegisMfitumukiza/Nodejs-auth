import express from 'express';
import databaseConnection from './database/database.js';
import authRoutes from './routes/auth-routes.js';
import homeRoutes from './routes/home-routes.js'
import adminRoutes from './routes/admin-route.js'
import ImageRoutes from './routes/image-routes.js'



const app = express();
const PORT = process.env.PORT || 3000;

databaseConnection();

app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', ImageRoutes);



app.listen(PORT, () => {
    console.log(`the Server is listening to port ${PORT}`);
});