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
    res.render('/user', {username: sessionStorage.getItem('username')})

    // res.render('patient_dashboard', { user: req.user.toJSON() })
})


// Login page (with failure message displayed upon login failure)
authRouter.get('/login', (req, res) => {
    res.render('login.hbs', { flash: req.flash('error'), title: 'Login', layout: 'main2' })
})

authRouter.post('/login',
    passport.authenticate('local', {
        failureRedirect: './', failureFlash: true
    }),
    function(req, res){
        console.log("HIIIIIIIII")
        sessionStorage.setItem('username', req.user.username)
        return res.redirect('/user')

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