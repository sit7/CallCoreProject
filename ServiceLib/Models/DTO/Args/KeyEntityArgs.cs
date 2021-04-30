namespace ServiceLib.Models.DTO.Args
{

    public abstract class BaseEntityArgs
    {
        protected BaseEntityArgs() { }
    }

    public abstract class KeyEntityArgs<T>: BaseEntityArgs
        where T : struct
    {
        protected KeyEntityArgs()
        {
        }
        /// <summary>
        /// значение ключа, десериализуемое из JSON с клиента
        /// </summary>

        public T? Key { get; set; }
    }
}