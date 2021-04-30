namespace CallApp.Models.DTO.GlobalObject
{
    public class GlobalObjectDTO : GlobalObjectShortDTO
    {

        public string Name { get; set; }
        public int? Code { get; set; }

        public string UltraShortName { get; set; }
        public int ObjectTypeID { get; set; }

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

        public string HeadEMail { get; set; }
        public string HeadSignature { get; set; }

        public int? IsDepartment { get; set; }

        public int IsFew { get; set; }

        public string СorrAccount { get; set; }
        public string СorrBank { get; set; }
        public string PersonalAccount2 { get; set; }
        public int? Is24Group { get; set; }
        public int? IsIO { get; set; }
        public bool? IsBudget { get; set; }
        public int? ObjectGroupID { get; set; }



        public GlobalObjectDTO() { }
    }

}