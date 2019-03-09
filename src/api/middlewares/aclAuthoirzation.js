const config = require('config');

function _authorize() {
    return (req, res, next) => {
        (async () => {
            const tokenPayload = JSON.parse(req.headers['x-payload-header']),
                userRole = tokenPayload.role,
                GWUserID = tokenPayload.id,
                reqResource = req.route.path,
                reqMethod = req.method.toLowerCase(),
                roles = config.get('_acl.roles');

            for (let role in roles) {

                if (role === userRole) {
                    const roleObj = roles[role],
                        allowedResources = roleObj.resources;
                    let allowedPermissions = roleObj.permissions;

                    if (allowedResources.includes(reqResource) && allowedPermissions.includes(reqMethod)) {
                        next();
                    } else {
                        res.json({ msg: "Insufficient permissions to access resource" }) // 403
                    }
                    break;
                }
            }
        })()
    }
};

module.exports = _authorize;