using EdgeJs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sjkp.aztunnel
{
    class Program
    {
        public static async Task Start()
        {
            var onMessage = (Func<object, Task<object>>)(async (message) =>
            {
                return "Received string of length " + ((string)message).Length;
            });
            //    var func = Edge.Func(@"
            //    return function (data, callback) {
            //        callback(null, 'Node.js asa sd  welcomes ' + data + ' ' + __dirname );
            //    }
            //");


            //   node client.js sjkprelay1b2tpu2at4hjik.servicebus.windows.net tunnel listen ymR80t6A8/kav95Vn8iOS9KzxGp1FUk4ZPwmASkrJ/o= localhost 8869

            Environment.SetEnvironmentVariable("MYVARIABLE", "Hallo", EnvironmentVariableTarget.Process);

            var func = Edge.Func(@"return require('./../../../../dotnetclient.js')");

            Console.WriteLine(await func(new
            {
                ns = "sjkprelay1b2tpu2at4hjik.servicebus.windows.net",
                path = "tunnel",
                keyrule = "listen",
                key = "ymR80t6A8/kav95Vn8iOS9KzxGp1FUk4ZPwmASkrJ/o=",
                port = 8869,
                host = "localhost",
                onMessage = onMessage
            }));
        }

        static void Main(string[] args)
        {
            Start().Wait();
        }
    }
}
