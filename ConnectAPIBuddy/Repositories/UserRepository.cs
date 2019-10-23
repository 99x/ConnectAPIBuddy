using ConnectAPIBuddy.Models;
using ConnectAPIBuddy.Services;
using System;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IUserContext _context = null;
        public UserRepository(IUserContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            try
            {
                return await _context.UserLogin.FindSync(_ => true).ToListAsync();

            }catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<User> GetUserByEmail(string email)
        {
            try
            {
                return await _context.UserLogin.FindSync<User>(user => user.Email.Equals(email)).FirstOrDefaultAsync();
            }catch (Exception ex)
            {
                throw ex;
            }
        } 

        public async Task<bool> UserExists(string email)
        {
            try
            {
                User user = await _context.UserLogin.FindSync<User>(u => u.Email.Equals(email)).FirstOrDefaultAsync();
                if (user != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;

            }

        }

        public async Task<User> UserAthorized(User userIn)
        {
            try
            {
                User user = await _context.UserLogin.FindSync<User>(u => u.Email.Equals(userIn.Email)).FirstOrDefaultAsync();
                if (user == null)
                {
                    return null;
                }
                else
                {
                    if (user.Password == userIn.Password)
                    {
                        return user;
                    }

                    return null;
                }
            }
            catch (Exception ex)
            {
                throw ex;

            }
        }

        public async Task<bool> AddUser(User userIn)
        {
            try
            {
                await _context.UserLogin.InsertOneAsync(userIn);
                return true;
            }
            catch(Exception ex)
            {
                throw ex;
            }

            
        }
    }
}
