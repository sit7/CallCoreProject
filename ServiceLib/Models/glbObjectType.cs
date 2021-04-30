using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ServiceLib.Models
{
    public partial class glbObjectType
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public glbObjectType()
        {
            this.glbObject = new HashSet<glbObject>();
        }
        [Key]
        public int ObjectTypeID { get; set; }
        public Nullable<int> ObjectGroupID { get; set; }
        public string Name { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<glbObject> glbObject { get; set; }
        public virtual glbObjectGroup glbObjectGroup { get; set; }
    }
}
