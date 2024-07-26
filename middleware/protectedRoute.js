const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectedRoute = (req, res, next) => {
    const token = req.cookies.jwt;
    
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'test secret key', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                const user = await User.findById(decodedToken.id);
                if (user.role === 'admin') {
                    res.redirect('/admin');
                } else if (user.role === 'support agent') {
                    res.redirect('/supportAgent');
                } else {
                    res.redirect('/customer');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
};

const supportAgentProtectedRoute = (req, res, next) => {
    const token = req.cookies.jwt;
    
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'test secret key', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                const user = await User.findById(decodedToken.id);
                if (user.role === 'admin' || user.role === 'support agent') {
                    next();
                } else {
                    res.status(403).send(`
                        <html>
                            <body>
                                <h1>You are not authorized to make this request, requires: admin, support agent</h1>
                                <button onclick="window.location.href='/'">Go Back to Home</button>
                            </body>
                        </html>
                    `);
                }
            }
        });
    } else {
        res.redirect('/login');
    }
};

const adminProtectedRoute = (req, res, next) => {
    const token = req.cookies.jwt;
    
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'test secret key', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/');
            } else {
                const user = await User.findById(decodedToken.id);
                if (user.role === 'admin') {
                    next();
                } else {
                    res.status(403).send(`
                        <html>
                            <body>
                                <h1>You are not authorized to make this request, requires: admin</h1>
                                <button onclick="window.location.href='/'">Go Back to Home</button>
                            </body>
                        </html>
                    `);
                }
            }
        });
    } else {
        res.redirect('/login');
    }
};

module.exports = {protectedRoute, supportAgentProtectedRoute, adminProtectedRoute};