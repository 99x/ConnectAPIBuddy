using ConnectAPIBuddy.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Services
{
    public class UserContext : IUserContext
    {
        private readonly IMongoDatabase _database = null;

        public UserContext (IOptions<Settings> settings)
        {
            try
            {
                var client = new MongoClient(settings.Value.ConnectionString);
                _database = client.GetDatabase(settings.Value.DatabaseName);
            }catch (Exception ex)
            {
                throw ex;
            }
        }

        public IMongoCollection<User> UserLogin
        {
            get
            {
               return _database.GetCollection<User>("User");
            }
        }
    }
}
