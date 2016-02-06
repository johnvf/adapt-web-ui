
function camelCaseToRegular(str){
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
}

module.exports = {
  camelCaseToRegular: camelCaseToRegular
};