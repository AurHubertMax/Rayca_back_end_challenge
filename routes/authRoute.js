const { Router } = require('express');
const authController = require('../controllers/authController');
const { adminProtectedRoute, supportAgentProtectedRoute } = require('../middleware/protectedRoute');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authorization routes
 */

/**
 * @swagger
 * /signup:
 *   get:
 *     summary: Get the signup page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful
 */
router.get('/signup', authController.signup_get);

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', authController.signup_post);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Get the login page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful
 */
router.get('/login', authController.login_get);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User logged in
 *       400:
 *         description: Invalid input
 */
router.post('/login', authController.login_post);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out
 */
router.get('/logout', authController.logout_get);

//customer

/**
 * @swagger
 * /customer:
 *   get:
 *     summary: Get customer page
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Customer page
 */
router.get('/customer', authController.customer_get);

/**
 * @swagger
 * /customer/ticket:
 *   get:
 *     summary: Get all tickets of a customer
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: A list of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ticket ID
 *                       title:
 *                         type: string
 *                         description: The title of the ticket
 *                       description:
 *                         type: string
 *                         description: The description of the ticket
 *                       status:
 *                         type: string
 *                         enum: [open, closed, pending]
 *                         description: The status of the ticket
 *                       created_by:
 *                         type: string
 *                         description: The ID of the user who created the ticket
 *                       assigned_to:
 *                         type: string
 *                         description: The ID of the user to whom the ticket is assigned
 *                       last_updated_by:
 *                         type: string
 *                         description: The ID of the user who last updated the ticket
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The creation date of the ticket
 *                       customer_id:
 *                         type: string
 *                         description: The ID of the customer
 *       404:
 *         description: No tickets found for this customer
 *       400:
 *         description: Bad request
 */
router.get('/customer/ticket', authController.ticket_get_customer_id);

//support agent

/**
 * @swagger
 * /supportAgent:
 *   get:
 *     summary: Get support agent page
 *     tags: [Support Agent]
 *     responses:
 *       200:
 *         description: Support agent page
 *       401:
 *         description: Unauthorized
 */
router.get('/supportAgent', supportAgentProtectedRoute, authController.support_agent_get);

/**
 * @swagger
 * /supportAgent/ticket:
 *   get:
 *     summary: Get all tickets for a support agent
 *     tags: [Support Agent]
 *     responses:
 *       200:
 *         description: A list of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ticket ID
 *                       title:
 *                         type: string
 *                         description: The title of the ticket
 *                       description:
 *                         type: string
 *                         description: The description of the ticket
 *                       status:
 *                         type: string
 *                         enum: [open, closed, pending]
 *                         description: The status of the ticket
 *                       created_by:
 *                         type: string
 *                         description: The ID of the user who created the ticket
 *                       assigned_to:
 *                         type: string
 *                         description: The ID of the user to whom the ticket is assigned
 *                       last_updated_by:
 *                         type: string
 *                         description: The ID of the user who last updated the ticket
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The creation date of the ticket
 *                       customer_id:
 *                         type: string
 *                         description: The ID of the customer
 *       404:
 *         description: No tickets found for this support agent
 *       400:
 *         description: Bad request
 */
router.get('/supportAgent/ticket', supportAgentProtectedRoute, authController.ticket_get_support_agent);

/**
 * @swagger
 * /supportAgent/ticket:
 *   put:
 *     summary: Update a ticket by a support agent
 *     tags: [Support Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *                 description: The ID of the ticket to update
 *               lastUpdatedBy:
 *                 type: string
 *                 description: The ID of the user who last updated the ticket
 *     responses:
 *       200:
 *         description: The updated ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ticket ID
 *                     title:
 *                       type: string
 *                       description: The title of the ticket
 *                     description:
 *                       type: string
 *                       description: The description of the ticket
 *                     status:
 *                       type: string
 *                       enum: [open, closed, pending]
 *                       description: The status of the ticket
 *                     created_by:
 *                       type: string
 *                       description: The ID of the user who created the ticket
 *                     assigned_to:
 *                       type: string
 *                       description: The ID of the user to whom the ticket is assigned
 *                     last_updated_by:
 *                       type: string
 *                       description: The ID of the user who last updated the ticket
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: The creation date of the ticket
 *                     customer_id:
 *                       type: string
 *                       description: The ID of the customer
 *       404:
 *         description: Last updated by user does not exist or ticket not found
 *       400:
 *         description: Bad request
 */
router.put('/supportAgent/ticket', supportAgentProtectedRoute, authController.ticket_put_support_agent);

//admin

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get admin page
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin page
 *       401:
 *         description: Unauthorized
 */
router.get('/admin', adminProtectedRoute, authController.admin_get);

/**
 * @swagger
 * /admin/ticket:
 *   get:
 *     summary: Get all tickets for an admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ticket ID
 *                       title:
 *                         type: string
 *                         description: The title of the ticket
 *                       description:
 *                         type: string
 *                         description: The description of the ticket
 *                       status:
 *                         type: string
 *                         enum: [open, closed, pending]
 *                         description: The status of the ticket
 *                       created_by:
 *                         type: string
 *                         description: The ID of the user who created the ticket
 *                       assigned_to:
 *                         type: string
 *                         description: The ID of the user to whom the ticket is assigned
 *                       last_updated_by:
 *                         type: string
 *                         description: The ID of the user who last updated the ticket
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The creation date of the ticket
 *                       customer_id:
 *                         type: string
 *                         description: The ID of the customer
 *       404:
 *         description: No tickets found
 *       400:
 *         description: Bad request
 */
router.get('/admin/ticket', adminProtectedRoute, authController.ticket_get_admin);

/**
 * @swagger
 * /users/filter/{filterType}/{filterValue}:
 *   get:
 *     summary: Get filtered users
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: filterType
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of filter (e.g., role, id)
 *       - in: path
 *         name: filterValue
 *         required: true
 *         schema:
 *           type: string
 *         description: The value of the filter
 *     responses:
 *       200:
 *         description: A list of filtered users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user ID
 *                       name:
 *                         type: string
 *                         description: The name of the user
 *                       email:
 *                         type: string
 *                         description: The email of the user
 *                       role:
 *                         type: string
 *                         description: The role of the user
 *       400:
 *         description: Bad request (e.g., missing or invalid filterType/filterValue)
 */
router.get('/admin/usersFiltered/:filterType/:filterValue', adminProtectedRoute, authController.users_get_filtered);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users for an admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user ID
 *                       name:
 *                         type: string
 *                         description: The name of the user
 *                       email:
 *                         type: string
 *                         description: The email of the user
 *                       role:
 *                         type: string
 *                         description: The role of the user
 *       404:
 *         description: No users found
 *       400:
 *         description: Bad request
 */
router.get('/admin/users', adminProtectedRoute, authController.users_get);

/**
 * @swagger
 * /admin/ticket:
 *   put:
 *     summary: Update a ticket by an admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *                 description: The ID of the ticket to update
 *               status:
 *                 type: string
 *                 enum: [open, closed, pending]
 *                 description: The status of the ticket
 *               assignedTo:
 *                 type: string
 *                 description: The ID of the user to whom the ticket is assigned
 *               lastUpdatedBy:
 *                 type: string
 *                 description: The ID of the user who last updated the ticket
 *     responses:
 *       200:
 *         description: The updated ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ticket ID
 *                     title:
 *                       type: string
 *                       description: The title of the ticket
 *                     description:
 *                       type: string
 *                       description: The description of the ticket
 *                     status:
 *                       type: string
 *                       enum: [open, closed, pending]
 *                       description: The status of the ticket
 *                     created_by:
 *                       type: string
 *                       description: The ID of the user who created the ticket
 *                     assigned_to:
 *                       type: string
 *                       description: The ID of the user to whom the ticket is assigned
 *                     last_updated_by:
 *                       type: string
 *                       description: The ID of the user who last updated the ticket
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: The creation date of the ticket
 *       404:
 *         description: Last updated by user does not exist or ticket not found
 *       400:
 *         description: Bad request
 */
router.put('/admin/ticket', adminProtectedRoute, authController.ticket_put_admin);

/**
 * @swagger
 * /admin/ticket:
 *   delete:
 *     summary: Delete a ticket by an admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *                 description: The ID of the ticket to delete
 *     responses:
 *       200:
 *         description: The deleted ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ticket ID
 *                     title:
 *                       type: string
 *                       description: The title of the ticket
 *                     description:
 *                       type: string
 *                       description: The description of the ticket
 *                     status:
 *                       type: string
 *                       enum: [open, closed, pending]
 *                       description: The status of the ticket
 *                     created_by:
 *                       type: string
 *                       description: The ID of the user who created the ticket
 *                     assigned_to:
 *                       type: string
 *                       description: The ID of the user to whom the ticket is assigned
 *                     last_updated_by:
 *                       type: string
 *                       description: The ID of the user who last updated the ticket
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: The creation date of the ticket
 *       400:
 *         description: Bad request
 */
router.delete('/admin/ticket', adminProtectedRoute, authController.ticket_delete_admin);


//ticket routes

/**
 * @swagger
 * /admin/ticket:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the ticket
 *               description:
 *                 type: string
 *                 description: The description of the ticket
 *               status:
 *                 type: string
 *                 enum: [open, closed, pending]
 *                 description: The status of the ticket
 *               customer_id:
 *                 type: string
 *                 description: The ID of the customer creating the ticket
 *     responses:
 *       201:
 *         description: The created ticket ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket:
 *                   type: string
 *                   description: The ID of the created ticket
 *       404:
 *         description: Customer ID does not exist
 *       400:
 *         description: Bad request
 */
router.post('/ticket',  authController.ticket_post);

/**
 * @swagger
 * /ticket:
 *   get:
 *     summary: Redirect ticket get requests to the appropriate route based on user role
 *     tags: [Ticket]
 *     responses:
 *       302:
 *         description: Redirect to the appropriate ticket route
 *         headers:
 *           Location:
 *             description: The URL to which the request is redirected
 *             schema:
 *               type: string
 *       404:
 *         description: User does not exist
 */
router.get('/ticket', authController.ticket_get);



module.exports = router;