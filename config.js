/*
* Configurations
*
*/

// Container for all enviromments
let enviroments = {};

// Development (default) enviroment
enviroments.staging = {
    'httpPort': 4020,
    'envName': 'development'
};

// Production enviroment
enviroments.production = {
    'httpPort': 2040,
    'envName': 'production'
};

// Deternime wich enviroment was passed as a command-line argument
let currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current enviroment is one of the enviroments above, if not, default to staging
let enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

// Export the module
module.exports = enviromentToExport;