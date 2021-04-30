using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ServiceLib.Models
{
    [Table("AspNetUsers")]
    public class AppUser:IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Surname { get; set; }

        [DefaultValue(0)]
        public int ObjectID { get; set; }
        public string ObjectName { get; set; }
        public string ReportServerURL { get; set; }
        public int ObjectGroupID { get; set; }
        public int ApplicationID { get; set; }

        //[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        //public AppUser()
        //{
        //    supCall = new HashSet<supCall>();
        //}
        //[NotMapped]
        public virtual glbObject glbObject { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<glbUserObject> glbUserObject { get; set; }
        
    }

    public class AppClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppUser, AppRole>
    {
        public AppClaimsPrincipalFactory(
            UserManager<AppUser> userManager
            , RoleManager<AppRole> roleManager
            , IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, roleManager, optionsAccessor)
        { }

        public async override Task<ClaimsPrincipal> CreateAsync(AppUser user)
        {
            var principal = await base.CreateAsync(user);

            if (!string.IsNullOrWhiteSpace(user.FirstName))
            {
                ((ClaimsIdentity)principal.Identity)
                    .AddClaims(new[] {new Claim("FirstName", user.FirstName)});
            }

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                ((ClaimsIdentity)principal.Identity)
                    .AddClaims(new[] { new Claim("Email", user.Email) });
            }

            if (!string.IsNullOrWhiteSpace(user.LastName))
            {
                ((ClaimsIdentity)principal.Identity)
                    .AddClaims(new[] {new Claim("LastName", user.LastName)});
            }

            if (!string.IsNullOrWhiteSpace(user.ObjectName))
            {
                ((ClaimsIdentity)principal.Identity)
                    .AddClaims(new[] {new Claim("ObjectName", user.ObjectName)});
            }

            return principal;
        }
    }
}
