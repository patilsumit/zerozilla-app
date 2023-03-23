import * as express from 'express';
import userController from '../controllers/user.controller';
import agencyController from '../controllers/agency.controller';
import { isAuth } from '../middleware/auth';


const router = express.Router();

/*****Signup and Login User End Points*******/
router.post('/signup', userController.userSignUp);
router.post('/user-login', userController.userLogin);

/*****Agency and Client End Points*******/
router.post('/agency-clients', isAuth, agencyController.createAgencyClients);
router.patch('/client/:clientId/update', isAuth, agencyController.updateClient);
router.get('/clients', isAuth, agencyController.getTopBillClient);





export default router;
