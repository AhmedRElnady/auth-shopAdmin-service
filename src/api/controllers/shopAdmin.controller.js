const express = require('express');
const router = express.Router();
const ShopAdmin = require('../../models/shop-admin.model');
const validate = require('../middlewares/validator');
const authorize = require('../middlewares/aclAuthoirzation');

// this resource is accessed internally from /signup route in gateway, to add details of admin's data in this service db.
router.post('/signup', async (req, res, next) => {
    try { 
        
        const createdShopAdmin = await ShopAdmin.create({
            gatewayIDFK: req.body.GWUserID,
            name: req.body.GWUserName
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
        res.status(200).send(shopAdminDetails);

    } catch (err) {

    }
});

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// all these routes allowed only by super-admin role


router.post('/:id/approve', authorize(), async (req, res, next) => {
    try {

        const adminId = req.params.id; //TODO: validate it first 
        const admin = await ShopAdmin.findById(adminId);
        if (!admin) return res.status(404).json({ msg: `There are no admin with this id ${adminId} !`});

        await ShopAdmin.updateOne({_id: adminId},{
            $set: {
                approved: true
            }
        });

        res.status(200).json({ msg: `New admin has been approved.`});
    


    } catch(e) {

    }
});

router.delete('/:id/approve', authorize(), async (req, res, next) => {
    try {
        const adminId = req.params.id; //TODO: validate it first 
        const admin = await ShopAdmin.findById(adminId);
        if (!admin) return res.status(404).json({ msg: `There are no admin with this id ${adminId} !`});

        await ShopAdmin.updateOne({_id: adminId},{
            $set: {
                approved: false
            }
        });

        res.status(200).json({ msg: `admin request has been rejected.`});
    } catch(e) {

    }
});

// to update activated, shopId and permissions
router.patch('/:id', authorize(), async (req, res, next)=> {
    try {
        const adminId = req.params.id, //TODO: validate it first     
            isActivated = req.body.activated,
            shopId = req.body.shopId,
            permissions = req.body.permissions;

        // Todo: seperate logic in a service 
        const admin = await ShopAdmin.findById(adminId);
        if (!admin) return res.json({ msg: `There are no admin with this id ${adminId} !`});

        if(isActivated && !shopId) return res.json({ msg: `you should assign a shop to an activated admin !`});
        
        let setObj = {
            activated: isActivated,
            permissions: permissions
        };
        
        // the case that this shopId is already assigned to another shop-admin (ask Business)
        if(shopId) {                
            // make it async operations (ask: business)
            await ShopAdmin.findOneAndUpdate({shopId: shopId}, {
                $set: {
                    shopId: null,
                    activated: false
                }
            })
    
            setObj.shopId = shopId;
        }

        await ShopAdmin.updateOne({ _id: adminId}, {
            $set: setObj
        });

        res.status(200).json({
            msg: 'shop-admin is updated successfully.'
        });
    } catch(e) {

    }
})

// refactorrrrrrrrrrrrrrrrrr
router.post('/', authorize(), async (req, res, next) => {
    const rqtype = req.body.report || req.query.report,
        page = +req.body.page || +req.query.page || 1,
        limit = +req.query.limit || 10,
        paginationOptions = { select: 'name activated'};


    let query = {},
        offset = (page -1) * limit;

    if(!rqtype) return res.status(422).send({ error: 'Posted data is not correct or incompleted.'});
    // todo: seperate in a service function 
    if(rqtype === 'ALL_APPROVED') {
        query = { approved: true };
        const count = await ShopAdmin.count(query)
        if(count > offset) offset = 0;
    } else if (rqtype === 'ALL_DIS_APPROVED') { // admin requests
        query = { approved: false };
        const count = await ShopAdmin.count(query)
        if(count > offset) offset = 0;
    } else if (rqtype === 'ACTIVATED') {
        query = { activated: true };
        const count = await ShopAdmin.count(query)
        if(count > offset) offset = 0;
    } else if (rqtype === 'DIS_ACTIVATED') {
        query = { activated: false };
        const count = await ShopAdmin.count(query)
        if(count > offset) offset = 0;
    };

    paginationOptions.offset = offset;
    paginationOptions.limit = limit;


    const paginatedAdmins = await ShopAdmin.paginate(query, paginationOptions)
    res.status(200).json({
        success: true,
        data: paginatedAdmins
    })
})

module.exports = router;    