class querys
{
    static getDataUsers(db){
        try{
            return db.collection("usersCloudPBX").aggregate([])
                .toArray()
                .catch(err=>{
                    console.log(err);
                })
        }catch(e){
            console.log(e);
        }
    }
    static getSkusPBX(db){
        try
        {
            return db.collection("skusPBX").aggregate([])
                .toArray()
                .catch(err=>{
                    console.log(err);
                })
        }catch(e){
            console.log(e);
        }
    }
}

module.exports = querys;