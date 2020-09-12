
//get current week integer
Date.prototype.getWeek = function() {
    const janFirst = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - janFirst) / 86400000) + janFirst.getDay()+1)/7);
};

console.log(new Date().getWeek());
