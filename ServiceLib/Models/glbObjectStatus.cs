using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ServiceLib.Models
{
    public partial class glbObjectStatus
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public glbObjectStatus()
        {
            this.glbObject = new HashSet<glbObject>();
        }
        [Key]
        public int ObjectStatusID { get; set; }
        public string Name { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<glbObject> glbObject { get; set; }
    }
}
