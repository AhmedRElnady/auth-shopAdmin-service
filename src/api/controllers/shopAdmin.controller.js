const express = require('express');
const router = express.Router();
const ShopAdmin = require('../../models/shop-admin.model');
const validate = require('../middlewares/validator');
const authorize = require('../middlewares/aclAuthoirzation');

// this resource is accessed internally from /signup route in gateway, to add details of admin's data in this service db.
router.post('/signup', async (req, res, next) => {
    try { 
        
        const createdShopAdmin = await ShopAdmin.create({
            gatewayIDFK: req.body.GWUserID
        });

        res.status(201).send(createdShopAdmin);

    } catch (e) {

    }
});
/*

 this resource is accessed internally from /login route in gateway, to add details of admin's data in this service db.
 to get details of logged in admin, to add what you want to jwt, to decrease db hits
 But don't add roles to jwt. (admin UX and statless approach of jwt(revocation))
*/
router.get('/:gatewayUserId', async (req, res, next) => {
    try {
        const shopAdminDetails = await ShopAdmin.findOne({ gatewayIDFK: req.params.gatewayUserId })
        res.status(200).send(shopAdminDetails)
    } catch (err) {

    }
});

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// all these routes allowed only by super-admin role
router.post('/:id/approve', authorize(), async (req, res, next) => {
    try {
        console.log('$$$$$ msg from approve')

    } catch(e) {

    }
});

router.delete('/:id/approve', authorize(), async (req, res, next) => {
    try {

    } catch(e) {

    }
});

router.patch('/:id/assign-shop', authorize(), async (req, res, next) => {
    try {

    } catch(e) {

    }
});

router.patch('/:id/roles', authorize(), async (req, res, next) => {
    try {

    } catch(e) {

    }
});


module.exports = router;    