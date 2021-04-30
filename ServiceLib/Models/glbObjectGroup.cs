using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ServiceLib.Models
{
    public partial class glbObjectGroup
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public glbObjectGroup()
        {
            this.glbObjectType = new HashSet<glbObjectType>();
        }
        [Key]
        public int ObjectGroupID { get; set; }
        public string Name { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<glbObjectType> glbObjectType { get; set; }
    }
}
