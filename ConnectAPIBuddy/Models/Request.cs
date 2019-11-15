using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace ConnectAPIBuddy.Models
{
    public class Request
    {
        public string Url { get; set; }
        public string Method { get; set; }
        public HeaderVal[] PayloadHeaders { get; set; }
        public FormVal[] FormContent { get; set; }
        public string PayloadBody { get; set; }
        public TestSetting TestSettings { get; set; }
        public int BodyTabSelectedIndex { get; set; }


        
    }

    public class TestSetting
    {
        public int TimeOutMs { get; set; }
        public int MaxRetry { get; set; }
        public int Delayms { get; set; }
    }
}
