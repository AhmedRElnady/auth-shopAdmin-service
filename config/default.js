module.exports = {
   server: {
      port: 5000
   },
   db: {
      name: 'soc-shop-admins'
   },
   _acl: {
      roles: {
         SUPER_ADMIN: {
            resources: [
               "/signup",
               "/:id/approve",
               "/:id/assign-shop",
               "/:id/roles"
            ],
            permissions: ["get, post, put, delete"]
         }
      }
   }
}