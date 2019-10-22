using ConnectAPIBuddy.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Repositories
{
    public interface IUserRepository
    {
        //GET
        Task<IEnumerable<User>> GetAll();
        Task<User> GetUserByEmail(string email);
        Task<bool> UserExists(string email);
        Task<bool> UserAthorized(User user);

        //POST
        Task<bool> AddUser(User userIn);

    }
}
