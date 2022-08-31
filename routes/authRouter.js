const passport = require('passport')
const express = require('express')
const authRouter = express.Router()
const bodyParser = require('body-parser')
const sessionStorage = require('sessionstorage')
const appController = require('../controllers/appController.js')
const user = require('../models/user')

authRouter.use(bodyParser.urlencoded({ extended: false }));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

// Main page which requires login to access
// Note use of authentication middleware here
authRouter.get('/user_homepage', isAuthenticated, (req, res) => {
    console.log("Loaded user homepage (authRouter.js)")
    console.log(req.user.username)
    sessionStorage.setItem('username', req.user.username)
    sessionStorage.setItem('role', req.user.role)
    res.redirect('/user_homepage')
    //appController.getPatientDashboard(req, res)

    // res.render('patient_dashboard', { user: req.user.toJSON() })
})


// Login page (with failure message displayed upon login failure)
authRouter.get('/login', (req, res) => {
    res.render('login', { flash: req.flash('error'), title: 'Login', layout: 'main2' })
})

// Handle login
// authRouter.post('/login',
//     passport.authenticate('local', {
//         successRedirect: '/patient_dash', failureRedirect: '/login', failureFlash: true
//     })
// )
authRouter.post('/login',
    passport.authenticate('local', {
         failureRedirect: '/login_page', failureFlash: true
    }),
    function(req, res){
        const role = appController.getPatientRole(req, res) 
        console.log(role)
        sessionStorage.setItem('role', role)
        sessionStorage.setItem('username', req.user.username)
        res.redirect('/user_homepage')

    }
    // (req, res) => {
    //     console.log('user ' + req.user.username + ' logged in with role ' + req.user.role)     // for debugging
    //     res.redirect('/patient_dash')   // login was successful, send user to home page
    // }
)

// Handle logout
authRouter.get('/logout', (req, res) => {
    console.log("Running Logout")
    req.logout()
    res.redirect('/')
})
module.exports = authRouter