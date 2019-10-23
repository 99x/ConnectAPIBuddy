using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ConnectAPIBuddy.Models;
using ConnectAPIBuddy.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ConnectAPIBuddy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserRepository _userService = null;

        public UserController(IUserRepository userService)
        {
            _userService = userService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IEnumerable<User>> GetAll()
        {
            return await _userService.GetAll();
        }

        [HttpGet("getUser/{email}")]
        public async Task<User> GetUserByEmail(string email)
        {
            return await _userService.GetUserByEmail(email) ?? null;
        }

        [HttpGet("exists/{email}")]
        public async Task<bool> UserExists(string email)
        {
            return await _userService.UserExists(email);
        }

        [HttpPost("athorized")]
        public async Task<User> UserAthorized(User userIn)
        {
            return await _userService.UserAthorized(userIn);
        }

        [HttpPost]
        public async Task<bool> AddUser(User userIn)
        {
            return await _userService.AddUser(userIn);
        }
    }
}