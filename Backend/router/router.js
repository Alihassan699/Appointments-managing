import express from 'express';
import { 
    getAppointments, 
    getAppointmentById, 
    createAppointment, 
    updateAppointment, 
    deleteAppointment 
} from '../controller/controller.js';

const router = express.Router();


router.get('/appointments', getAppointments);


router.get('/appointments/:id', getAppointmentById);


router.post('/appointments', createAppointment);


router.put('/appointments/:id', updateAppointment);

router.delete('/appointments/:id', deleteAppointment);

export default router;
