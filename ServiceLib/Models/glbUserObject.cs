using System.ComponentModel.DataAnnotations;

namespace ServiceLib.Models
{


    public partial class glbUserObject
    {
        [Key]
        public int UserObjectID { get; set; }
        public int UserID { get; set; }
        public int ObjectID { get; set; }
        public virtual glbObject glbObject { get; set; }
        public virtual AppUser AppUser { get; set; }
    }
}
