module.export ={
    apps:[
        {
            name:"eCommerce-backend-app",
            script:"./dist/app.js",
            instances:"max",
            exec_mode:"cluster",
            env:{
                NODE_ENV:"development",
            },
            env_production:{
                NODE_ENV:"production"
            },
        },
    ],
};