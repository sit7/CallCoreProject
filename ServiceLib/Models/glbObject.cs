//food in food1
//food in food2
namespace ServiceLib.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class glbObject
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public glbObject()
        {
            this.glbUserObject = new HashSet<glbUserObject>();
        }
        [Key]
        public int ObjectID { get; set; }
        public string Name { get; set; }
        public Nullable<int> Code { get; set; }
        public string ShortName { get; set; }
        public string UltraShortName { get; set; }
        public int ObjectTypeID { get; set; }
        public string PostIndex { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Region { get; set; }
        public string HouseNumber { get; set; }
        public string PhoneNumber { get; set; }
        public string FaxNumber { get; set; }
        public string EMail { get; set; }
        public string WWW { get; set; }
        public string INN { get; set; }
        public string KPP { get; set; }
        public string OKPO { get; set; }
        public string OKVED { get; set; }
        public string BankName { get; set; }
        public string BIC { get; set; }
        public string CurrentAccount { get; set; }
        public string PersonalAccount { get; set; }
        public string HeadPosition { get; set; }
        public string HeadFIO { get; set; }
        public string HeadPhoneNumber { get; set; }
        public string HeadEMail { get; set; }
        public string HeadSignature { get; set; }
        public Nullable<int> OrderNumber { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public Nullable<int> IsDepartment { get; set; }
        public Nullable<int> MainObjectID { get; set; }
        public Nullable<int> ObjectStatusID { get; set; }
        public int IsFew { get; set; }
        public string HouseBlock { get; set; }
        public string СorrAccount { get; set; }
        public string СorrBank { get; set; }
        public string PersonalAccount2 { get; set; }
        public Nullable<int> Is24Group { get; set; }
        public Nullable<int> IsIO { get; set; }
        public Nullable<bool> IsBudget { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<glbUserObject> glbUserObject { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AppUser> AppUser { get; set; }
        public virtual glbObjectType glbObjectType { get; set; }
        public virtual glbObjectStatus glbObjectStatus { get; set; }
    }
}
