//using Microsoft.Ajax.Utilities;

namespace CallApp.Models.DTO.GlobalObject
{

    public class GlobalObjectShortDTO
    {
        public int ObjectID { get; set; }
        public string ShortName { get; set; }
        public string PostIndex { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Region { get; set; }
        public string HouseNumber { get; set; }
        public string HouseBlock { get; set; }
        public string HeadFIO { get; set; }
        public string PhoneNumber { get; set; }
        public string HeadPhoneNumber { get; set; }

        public int? MainObjectID { get; set; }
        public int? ObjectStatusID { get; set; }

        //public string FullAddress => $"{(PostIndex.IsNullOrWhiteSpace() ? "ИНДЕКС НЕ УКАЗАН" : PostIndex)}, {City}, {Street}, {HouseNumber}{(HouseBlock?.Length > 0 ? "/" + HouseBlock : string.Empty)}";
        public string FullAddress => $"{PostIndex}, {City}, {Street}, {HouseNumber}{(HouseBlock?.Length > 0 ? "/" + HouseBlock : string.Empty)}";
        public GlobalObjectShortDTO() { }
    }

}