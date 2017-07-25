# Localhost Tunnel with Azure Relay Hybrid Connections  
The project allows you to expose a web service hosted locally to the internet using Azure Relay Hybrid Connections.

Using Azure Relay makes it easy to create a tunnel from you local machine to the internet without having to worry about
firewalls and NAT. The project provides similar functionality like [https://ngrok.io](https://ngrok.io) and [https://localtunnel.me](https://localtunnel.me), but instead of 
relying on a 3rd party you host the infrastructure required in your own Azure subscription. This provides better security as no 
3rd party have access to traffic in the tunnel, from my experience it is also faster as you are using your own dedicated infrastructure. 
Finally and it costs less than 2 cents per hour (traffic above 5GB costs extra, see the [Azure pricing](https://azure.microsoft.com/en-us/pricing/details/service-bus/) for more info).     

To get started you need to deploy the server component and the Azure Relay Hybrid Connection to an Azure subscription. The easiest
way to do so it to deploy the Azure Resource Manager (ARM) template by clicking the Deploy to Azure button here. 

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fsjkp%2Fazure-localhost-tunnel%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

The ARM template setups an Azure Web App (on a free hosting plan), that will be your public URL for you local web service. 
It also creates the Azure Relay Hybrid connection and configures it so it is ready to use. 

After deploying the template you get a node command you need to run locally, together with the url of the web app, which you can 
use to access your local web service.  

To run node application locally, that controls which port that you want to make available on the public internet you need to clone this repository and run

`npm install` 

Once the packages are installed you can start the local client component using the command giving from the deployment if should have the format like:

`node client.js [your-relay-namespace].servicebus.windows.net tunnel listen [your-SAS-key] localhost [port]`

 

## Security note
> This project permits everyone on the internet to establish a tunnel 
> to the TCP network destination that the client is exposing. The project provides no protection of your local web service, 
> thus only expose web services that doesn't contain confidential information. 
>
> If you want to prevent unauthorized access to your
> local web service you can configure Azure App Service to use Active Directory as an identity provider using the [express settings](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication) in the Azure portal  

## Inspiration 
This project was inspired by the sample code from [hybrid-connections-websocket-tunnel](https://github.com/Azure/azure-relay/tree/master/samples/Hybrid%20Connections/Node/hyco-websocket-tunnel)  
that sample illustrates how to create fully transparent TCP socket tunnels using Azure Relay
Hybrid Connections with Node. 


