using ConnectAPIBuddy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Repositories
{
    public interface ITestConfigRepository
    {
        //Get 
        Task<IEnumerable<TestConfiguration>> GetAllTestConfigurations();
        Task<TestConfiguration> GetTestConfiguration(string id);

        Task<IEnumerable<TestConfiguration>> GetTestConfigurations(string baseUrl);

        //Add
        Task<TestConfiguration> AddTestConfiguration(TestConfiguration testConfigIn);

        //Remove
        Task<bool> RemoveTestConfiguation(string id);

        //Update
        Task<bool> UpdateTestConfiguration(string id, TestConfiguration testConfigIn);

        //Remove All(just for developent purposes
        Task<bool> RemoveAll();

        //Remove many
        Task<bool> RemoveTestConfigurations(string[] ids);
    }
}
