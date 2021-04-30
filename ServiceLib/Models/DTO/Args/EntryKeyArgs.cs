namespace ServiceLib.Models.DTO.Args
{
    public class EntryKeyArgs<T> : KeyEntityArgs<T> where T : struct
    {
        public EntryKeyArgs() { }
    }
}