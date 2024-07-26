const { Router } = require('express');
const authController = require('../controllers/authController');
const { adminProtectedRoute, supportAgentProtectedRoute } = require('../middleware/protectedRoute');

const router = Router();

//authorization routes
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

//customer
router.get('/customer', authController.customer_get);
router.get('/customer/ticket', authController.ticket_get_customer_id);

//support agent
router.get('/supportAgent/', supportAgentProtectedRoute, authController.support_agent_get);
router.get('/supportAgent/ticket', supportAgentProtectedRoute, authController.ticket_get_support_agent);
router.put('/supportAgent/ticket', supportAgentProtectedRoute, authController.ticket_put_support_agent);

//admin
router.get('/admin', adminProtectedRoute, authController.admin_get);
router.get('/admin/ticket', adminProtectedRoute, authController.ticket_get_admin);
router.get('/admin/usersFiltered/:filterType/:filterValue', adminProtectedRoute, authController.users_get_filtered);
router.get('/admin/users', adminProtectedRoute, authController.users_get);
router.put('/admin/ticket', adminProtectedRoute, authController.ticket_put_admin);
router.delete('/admin/ticket', adminProtectedRoute, authController.ticket_delete_admin);


//ticket routes
router.post('/ticket',  authController.ticket_post);
router.get('/ticket', authController.ticket_get);



module.exports = router;