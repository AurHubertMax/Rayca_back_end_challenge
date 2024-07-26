const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Ticket = require('../models/Ticket');




const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '', role: '' };

    // duplicate username
    if (err.code === 11000) {
        errors.username = 'that username is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    //username not found
    if (err.message === 'username doesnt exist') {
        errors.username = 'that username is not registered';
    }

    //incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect';
    }

    return errors;
}

const maxAge = 24*60*60;
const createToken = (id) => {
    return jwt.sign({id}, 'test secret key', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.customer_get = (req, res) => {
    res.render('customer');
}

module.exports.support_agent_get = (req, res) => {
    res.render('supportAgent');
}

module.exports.admin_get = (req, res) => {
    res.render('admin');
}

module.exports.signup_post = async (req, res) => {
    const { username, password, role } = req.body;
    
    try {
        const user = await User.create({ username, password, role });
        const token = createToken(user._id); // create jwt token
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}) // send it as a cookie
        res.status(201).json({user: user._id}); // only send the user id to frontend

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id); 
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}) 
        res.status(200).json({user: user._id});

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

// logout, just clear the jwt cookie
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/login');
}

// create a ticket
module.exports.ticket_post = async (req, res) => {
    const { title, description, status, customer_id } = req.body;
    const createdByUser = await User.findOne({_id: customer_id});
    const lastUpdatedByUser = createdByUser;

    if (!createdByUser) {
        res.status(404).json({errors: {customer_id: 'customer_id does not exist'}});
        return;
    }
    
    try {
        const newTicket = await Ticket.create({ title, description, status, created_by: createdByUser, last_updated_by: lastUpdatedByUser, customer_id });

        res.status(201).json({ticket: newTicket._id});

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}


// redirecting ticket get requests to the appropriate route
module.exports.ticket_get = async (req, res) => {
    const user = await User.findOne({_id: res.locals.user.id});
    if (!user) {
        res.status(404).json({errors: 'user does not exist'});
        return;
    }

    if (user.role === 'admin') {
        res.redirect('/admin/ticket');
    } else if (user.role === 'support agent') {
        res.redirect(`/supportAgent/ticket`);
    } else {
        
        res.redirect(`/customer/ticket`);
    }
    return;

}

// get all tickets for an admin
module.exports.ticket_get_admin = async (req, res) => {
    
    const tickets = await Ticket.find();
    if (!tickets || tickets.length === 0) {
        res.status(404).json({errors: 'No tickets found'});
        return;
    }
    try {
        res.status(200).json({tickets});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

// get all users for an admin
module.exports.users_get = async (req, res) => {
    const users = await User.find();
    if (!users || users.length === 0) {
        res.status(404).json({errors: 'No users found'});
        return;
    }
    try {
        res.status(200).json({users});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

// get users by id or role
module.exports.users_get_filtered = async (req, res) => {
    const { filterType, filterValue } = req.params;
    
    if (!filterType || !filterValue) {
        res.status(400).json({errors: 'filterType and filterValue are required'});
        return;
    }
    
    try {
        let users;
        if (filterType === 'role') {
            users = await User.find({role: filterValue});
        } else if (filterType === 'id') {
            users = await User.findOne({_id: filterValue});
        } else {
            res.status(400).json({errors: 'invalid filterType'});
            return;
        } 
        res.status(200).json({users});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

// update a ticket by an admin
module.exports.ticket_put_admin = async (req, res) => {
    const { ticketId, status, assignedTo, lastUpdatedBy } = req.body;
    const lastUpdatedByUser = await User.findOne({_id: lastUpdatedBy});

    if (!lastUpdatedByUser) {
        res.status(404).json({errors: {last_updated_by: 'last_updated_by does not exist'}});
        return;
    }
    try {
        if (assignedTo === '') {
            const ticket = await Ticket.findOneAndUpdate({_id: ticketId}, { status: status, last_updated_by: lastUpdatedByUser }, {new: true});
            res.status(200).json({ticket});
        } else {
            const ticket = await Ticket.findOneAndUpdate({_id: ticketId}, { status: status, assigned_to: assignedTo, last_updated_by: lastUpdatedByUser }, {new: true});
            res.status(200).json({ticket});
        }
        
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

// delete a ticket by an admin
module.exports.ticket_delete_admin = async (req, res) => {
    const { ticketId } = req.body;
    try {
        const ticket = await Ticket.findOneAndDelete({_id: ticketId});
        res.status(200).json({ticket});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

// get all tickets for a support agent
module.exports.ticket_get_support_agent = async (req, res) => {
    const tickets = await Ticket.find({assigned_to: res.locals.user.id});
    if (!tickets || tickets.length === 0) {
        res.status(404).json({errors: 'No tickets found for this support agent'});
        return;
    }

    try {
        res.status(200).json({tickets});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

// update a ticket by a support agent
module.exports.ticket_put_support_agent = async (req, res) => {
    const { ticketId, lastUpdatedBy } = req.body;
    const lastUpdatedByUser = await User.findOne({_id: lastUpdatedBy});
    const status = 'closed';

    if (!lastUpdatedByUser) {
        res.status(404).json({errors: {last_updated_by: 'last_updated_by does not exist'}});
        return;
    }
    try {
        const ticket = await Ticket.findOneAndUpdate({_id: ticketId}, { status: status, last_updated_by: lastUpdatedByUser }, {new: true});
        res.status(200).json({ticket});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}


// get all tickets of a customer
module.exports.ticket_get_customer_id = async (req, res) => {

    const tickets = await Ticket.find({customer_id: res.locals.user.id});
    if (!tickets || tickets.length === 0) {
        console.log('no tickets found');
        res.status(404).json({errors: 'No tickets found for this customer'});
        return;
    }

    try {
        res.status(200).json({tickets});
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}



