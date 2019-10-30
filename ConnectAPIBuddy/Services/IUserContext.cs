using ConnectAPIBuddy.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Services
{
    public interface IUserContext
    {
        IMongoCollection<User> UserLogin { get; }
    }
}
