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
               "/",
               "/:id/approve",
               "/:id"
            ],
            permissions: ["get", "post", "put", "patch", "delete"]
         }
      }
   }
}