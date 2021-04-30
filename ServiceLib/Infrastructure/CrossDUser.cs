using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using ServiceLib.Models;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;

namespace ServiceLib.Infrastructure
{
    //public class CustomRole : IdentityRole<int, CustomUserRole>
    //{
    //    //public CustomRole() { }
    //    //public CustomRole(string name) { Name = name; }
    //    //public int? ApplicationID { get; set; }
    //}

    //public class CustomUserStore : UserStore<ApplicationUser, CustomRole, int,
    //    CustomUserLogin, CustomUserRole, CustomUserClaim>
    //{
    //    public CustomUserStore(ApplicationDbContext context)
    //        : base(context)
    //    {
    //    }
    //}
    public class CrossDUser
    {
        private static CrossDUser current;

        public CrossDUser(ApplicationDbContext context, IHttpContextAccessor IHttpContextAccessor)
        {

            var principal = IHttpContextAccessor.HttpContext.User;
            if (principal != null && principal.Identity.IsAuthenticated)
            {
                
                FirstName = principal.FindFirst(c => c.Type == nameof(FirstName))?.Value;
                LastName = principal.FindFirst(c => c.Type == nameof(LastName))?.Value;
                Surname = principal.FindFirst(c => c.Type == nameof(Surname))?.Value;
                UserID = int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier));
                //UserID = int.Parse(principal.FindFirst(c => c.Type == nameof(UserID)).Value);
                //UserID = 3;
                var currentUser =  context.Users.FirstOrDefault(user => user.Id == UserID);
                ObjectID = currentUser.ObjectID;
                //var userObject = context.Database
                //    .SqlQuery<glbObject>("select * from glbObject where ObjectID = @objectId", new SqlParameter("@objectId", ObjectID))
                //    .FirstOrDefault();
                var userObject = context.glbObject.Where(w => w.ObjectID == ObjectID).FirstOrDefault();

                MainObjectID = userObject.MainObjectID.Value;
                Is24Group = (userObject.Is24Group == 1);
                ObjectGroupID = currentUser.ObjectGroupID;
                ObjectName = currentUser.ObjectName;
                ReportServiceURL = principal.FindFirst(c => c.Type == nameof(ReportServiceURL))?.Value;
                ApplicationID = currentUser.ApplicationID;
                var _roles = context.Roles.Select(r => r.Name).ToList();
                //Roles = currentUser.Roles.Select(r=> r.Role).ToList();
                if (currentUser.ApplicationID == null)
                {
                    if (principal.IsInRole("admin") || principal.IsInRole("manager"))
                    {
                        ApplicationID = 1;
                    }
                    else if (principal.IsInRole("report"))
                    {
                        ApplicationID = 6;
                    }
                    else
                    {
                        var roleName = _roles.First().ToUpper();

                        ApplicationID = CrossDApp.Applications
                            .First((meta) => meta.Key.ToUpper() == roleName)
                            .Value
                            .ApplicationID;
                    }

                }

                Application = CrossDApp.Applications
                    .FirstOrDefault(meta => meta.Value.ApplicationID == ApplicationID).Value;
                Principal = principal;
                current = this;
            }
        }

        public string FirstName { get; }
        public string LastName { get; }
        public string Surname { get; }
        public int UserID { get; }
        public int ObjectID { get;}
        public int MainObjectID { get; }
        public int ObjectGroupID { get; }
        public string ObjectName { get; }
        public string ReportServiceURL { get; }
        public int? ApplicationID { get; }
        public CrossDMeta Application { get; }
        public ClaimsPrincipal Principal { get; }
        //public List<CustomRole> Roles { get; } = new List<CustomRole>();
        public bool Is24Group { get; }
        public static CrossDUser Current
        {
            get
            {
                //    if (current == null)
                //        current = new CrossDUser();
                return current;
            }
            
        }
    }
}