const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const shopAdminScheam = new mongoose.Schema({ 
    gatewayIDFK : { //ensure index
        type: mongoose.Schema.Types.ObjectId,  // to populate accross databases
        required: true
    },
    /*
        I duplicate shop-admin [name] attribute -intentionally- here in the shop-admin service db,
        as an example of data that frequently retrieved.
        There are more than 4 other approaches as you mention in your notes.
    */
    name: {    
        type: String,
        required: true
    },
    approved: {
        type: Boolean, 
        default: false
    },
    activated: {
        type: Boolean, 
        default: false
    },
    shopId:{ // ensure Index
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    permissions: {
        type: Object,
        default: {
            read: true,
            edit: false,
            delete: false
        }
    }
}, {timestamps: true });

shopAdminScheam.set('toJSON', {
    transform: function (doc, ret, opt) {
        ret.id = ret._id;

        delete ret.deleted;
        delete ret._id;
        delete ret.__v;
    }
});

shopAdminScheam.plugin(mongoosePaginate);

const ShopAdmin = mongoose.model('ShopAdmin', shopAdminScheam);

module.exports = ShopAdmin;
