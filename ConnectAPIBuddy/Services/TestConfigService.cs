using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectAPIBuddy.Models;
using MongoDB.Driver;
using MongoDB.Bson;

namespace ConnectAPIBuddy.Services
{
    public class TestConfigService
    {
        private readonly IMongoCollection<TestConfiguration> _testConfigs;

        public TestConfigService(ITestConfigDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _testConfigs = database.GetCollection<TestConfiguration>(settings.TestConfigCollectionName);
        }

        public List<TestConfiguration> Get() =>
            _testConfigs.Find(testConfig => true).ToList();

        public TestConfiguration Get(string id) =>
            _testConfigs.Find<TestConfiguration>(testConfig => testConfig.Id == id).FirstOrDefault();

        public TestConfiguration Create(TestConfiguration testConfig)
        {
            _testConfigs.InsertOne(testConfig);
            return testConfig;
        }

        public void Update(string id, TestConfiguration testConfigIn) =>
            _testConfigs.ReplaceOne<TestConfiguration>(testConfig => testConfig.Id == id, testConfigIn);

        public void Remove(string id) =>
            _testConfigs.DeleteOne(testConfig => testConfig.Id == id);

        public List<TestConfiguration> GetbyName(string name) =>
            _testConfigs.Find(testConfig => testConfig.TestName.Equals(name)).ToList();
            





    }
}
