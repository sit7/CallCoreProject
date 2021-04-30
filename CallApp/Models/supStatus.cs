using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CallApp.Models
{
   
    public partial class supStatus
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public supStatus()
        {
            this.supCall = new HashSet<supCall>();
        }
        [Key]
        public int StatusID { get; set; }
        public string Name { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<supCall> supCall { get; set; }
    }
}
