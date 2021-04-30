namespace ServiceLib.Models.DTO.Args
{
    public class CounterSelectArgs : KeyEntityArgs<int>
    {
        public CounterSelectArgs() { }
        public int? ObjectID { get; set; }
        public int? BuildingID { get; set; }
        public int? CounterTypeID { get; set; }
        // показывать предстоящие поверки в ближайшие VerifyWithin дней
        public int? VerifyWithin { get; set; }
    }
}