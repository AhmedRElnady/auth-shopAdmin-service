const joi = require('joi');

// use AJv
function validate(opt) { /// clouser with opt
    return (req, res, next) => {
        (async ()=>{
            console.log(">>> msg from middle ware >>>", opt);

            next()
        })()
    }
}

module.exports = validate;