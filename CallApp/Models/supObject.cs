//начальное состояние - сделано для фиксации ветки master в корректном начальном положении
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CallApp.Models
{

    
    public partial class supObject
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public supObject()
        {
            this.supCall = new HashSet<supCall>();
        }
        [Key]
        public int ObjectID { get; set; }
        public string Name { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<supCall> supCall { get; set; }
    }
}
