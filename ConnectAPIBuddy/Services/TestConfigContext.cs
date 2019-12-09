using ConnectAPIBuddy.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Services
{
    public class TestConfigContext : ITestConfigContext
    {
        private readonly IMongoDatabase _database = null;

        public TestConfigContext (IOptions<Settings> settings)
        {
            try
            {
                var client = new MongoClient(settings.Value.ConnectionString);
                if (client != null)
                    _database = client.GetDatabase(settings.Value.DatabaseName);
            }catch (Exception ex)
            {
                throw ex;
            }
            
        }

        public IMongoCollection<TestConfiguration> TestConfig 
        {
            get
            {
                return _database.GetCollection<TestConfiguration>("TestConfigurations");
            }
        }
    }
}
