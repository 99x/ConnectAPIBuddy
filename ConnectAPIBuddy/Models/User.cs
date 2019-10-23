using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
[AttributeUsage(AttributeTargets.Property,
                Inherited = false,
                AllowMultiple = false)]
internal sealed class OptionalAttribute : Attribute
{
}
namespace ConnectAPIBuddy.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }

        public string Password { get; set; }
        [Optional]
        public string Id { get; set; }
        [Optional]
        public string Image { get; set; }
        [Optional]
        public string Provider { get; set; }
        [Optional]
        public string Token { get; set; }
        [Optional]
        public string IdToken { get; set; }

    }
}
