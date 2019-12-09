using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConnectAPIBuddy.Models;
using ConnectAPIBuddy.Repositories;
using ConnectAPIBuddy.Services;
using Microsoft.AspNetCore.Mvc;
using Serilog;


namespace ConnectAPIBuddy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestConfigController : Controller
    {
        private readonly ITestConfigRepository _testConfigService;
        public TestConfigController(ITestConfigRepository testConfigRrepository)
        {
            _testConfigService = testConfigRrepository;

        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<TestConfiguration> Create([FromBody]TestConfiguration testConfigIn)
        {
            return await _testConfigService.AddTestConfiguration(testConfigIn);

        }

        [HttpGet]
        public async Task<IEnumerable<TestConfiguration>> Get()
        {
            return await _testConfigService.GetAllTestConfigurations();
        }


        [HttpGet("{id:length(24)}", Name = "GetBook")]
        public async Task<TestConfiguration> Get(string id)
        {
            return await _testConfigService.GetTestConfiguration(id) ?? null;
        }

        [HttpGet("user/{id:length(24)}")]
        public async Task<IEnumerable<TestConfiguration>> GetbyUserid(string id)
        {
            return await _testConfigService.GetTestConfigurations(id) ?? null;
        }

        [HttpPut("{id:length(24)}")]
        public async Task<bool> Update(string id, TestConfiguration testConfigIn)
        {
            return await _testConfigService.UpdateTestConfiguration(id, testConfigIn);
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<bool> Delete(string id)
        {
            return await _testConfigService.RemoveTestConfiguation(id);
        }

        [HttpPost("deleteMany")]
        public async Task<bool> DeleteMany(string[] ids)
        {
            return await _testConfigService.RemoveTestConfigurations(ids);
        }

        [HttpDelete("Admin/delete")]
        public async Task<bool> DeleteAll()     /***********Only for developing purposes*****************/
        {
            return await _testConfigService.RemoveAll();
        }































        //[HttpPut("[controller]/{id:length(24)}")]
        //public ActionResult<TestConfiguration> Update(string id, TestConfiguration testConfigIn)
        //{
        //    var testConfig = _testConfigService.Get(id);
        //    if (testConfig == null)
        //    {
        //        return NotFound();
        //    }

        //    _testConfigService.Update(id, testConfigIn);

        //    return _testConfigService.Get(id);
        //}

        //[HttpDelete("[controller]/{id:length(24)}")]
        //public ActionResult<TestConfiguration> Delete(string id)
        //{
        //    var testConfig = _testConfigService.Get(id);
        //    if (testConfig == null)
        //    {
        //        return NotFound();
        //    }

        //    _testConfigService.Remove(id);
        //    return testConfig;
        //}

        //[HttpGet("[controller]/[action]/{name}")]
        //public ActionResult<List<TestConfiguration>> GetbyName(string name)
        //{
        //    var testConfig = _testConfigService.GetbyName(name);

        //    if (testConfig == null)
        //    {
        //        return NotFound();
        //    }

        //    return testConfig;
        //}
    }
}