using ConnectAPIBuddy.Models;
using ConnectAPIBuddy.Services;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Repositories
{
    public class TestConfigRepository : ITestConfigRepository
    {
        private readonly ITestConfigContext _context = null;

        public TestConfigRepository(ITestConfigContext context)
        {
            _context = context;
        }

        //Get all 
        public async Task<IEnumerable<TestConfiguration>> GetAllTestConfigurations()
        {
            try
            {
                return await _context.TestConfig.FindSync(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Get by id
        public async Task<TestConfiguration> GetTestConfiguration(string id)
        {
            try
            {
                ObjectId internalId = GetInternalId(id);
                return await _context.TestConfig.FindSync<TestConfiguration>(testConfig => testConfig.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        //Get by userId
        public async Task<IEnumerable<TestConfiguration>> GetTestConfigurations(string id)
        {
            try
            {           
                var query = _context.TestConfig.FindSync(testConfig => testConfig.UserId == id);
                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        //Add
        public  async Task<TestConfiguration> AddTestConfiguration(TestConfiguration testConfigIn)
        {
            try
            {
                await _context.TestConfig.InsertOneAsync(testConfigIn);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return testConfigIn;
        }

        //Update
        public async Task<bool> UpdateTestConfiguration(string id, TestConfiguration testConfigIn)
        {
            try
            {
                ReplaceOneResult actionResult = 
                    await _context.TestConfig.ReplaceOneAsync(t => t.Id.Equals(id),
                                                                testConfigIn,
                                                                new UpdateOptions { IsUpsert = true }) ;
                return actionResult.IsAcknowledged
                    && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
 
        }

        //Delete one
        public async Task<bool> RemoveTestConfiguation(string id)
        {
            try
            {
                ObjectId internalId = GetInternalId(id);
                DeleteResult actionResult
                = await _context.TestConfig.DeleteOneAsync(
                    Builders<TestConfiguration>.Filter.Eq("Id", internalId));

                return actionResult.IsAcknowledged
                    && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Delete all
        public async Task<bool> RemoveAll()
        {
            try
            {
                DeleteResult actionResult
                    = await _context.TestConfig.DeleteManyAsync(new BsonDocument());

                return actionResult.IsAcknowledged
                    && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }







        private ObjectId GetInternalId(string id)
        {
            ObjectId internalId;
            if (!ObjectId.TryParse(id, out internalId))
                internalId = ObjectId.Empty;

            return internalId;
        }
    }
}
