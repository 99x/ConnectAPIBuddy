using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Models
{
    public class TestConfigDatabaseSettings : ITestConfigDatabaseSettings
    {
        public string TestConfigCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface ITestConfigDatabaseSettings
    {
        string TestConfigCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
