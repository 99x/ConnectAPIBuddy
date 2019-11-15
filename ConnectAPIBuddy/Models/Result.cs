using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ConnectAPIBuddy.Models
{
    public class Result
    {
        public string Body { get; set; }
        public HttpStatusCode Status { get; set; }
    }
}
