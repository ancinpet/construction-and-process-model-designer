using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VSContractBackend.HubConfig
{
    /// <summary>
    /// Action Hub receives actions from client and resends them to other clients
    /// </summary>
    public class ActionHub : Hub
    {
        /// <summary>
        /// DispatchAction is called asynchronously from clients, to send action to other clients
        /// action is decomposed to type and payload
        /// </summary>
        /// <param name="type">action type</param>
        /// <param name="payload">action payload in JSON fromat</param>
        /// <returns></returns>
        public async Task DispatchAction(string type, string payload)
        {
            await Clients.Others.SendAsync("ReceiveAction", type + "_RECEIVED", payload);
        }
    }
}
