using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CallApp.Models
{
    public partial class supUser
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public supUser()
        {
            this.CreateUserCalls = new HashSet<supCall>();
            this.ResponsibleUserCalls = new HashSet<supCall>();
        }
        [Key]
        public int UserID { get; set; }
        public string ShortName { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<supCall> CreateUserCalls { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<supCall> ResponsibleUserCalls { get; set; }
    }
}
