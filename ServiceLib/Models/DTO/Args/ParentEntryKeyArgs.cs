using ServiceLib.Models.DTO.Common;

namespace ServiceLib.Models.DTO.Args
{
    public class ParentEntryKeyArgs<T, TOwnerKey> : KeyEntityArgs<T>, IParentKey<TOwnerKey> where T : struct where TOwnerKey : struct
    {
        public ParentEntryKeyArgs() { }

        public TOwnerKey? ParentKey { get; set; }
    }
}