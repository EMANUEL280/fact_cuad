class cloudPBX {
	constructor({
        serviceProviderId,
        groupId,
        sku,
        skuName,
        qty,
        typeUsers
    }){
        if(serviceProviderId!=undefined)this.serviceProviderId=serviceProviderId;
        if(groupId!=undefined)this.groupId=groupId;
        if(sku!=undefined)this.sku=sku;
        if(skuName!=undefined)this.skuName=skuName;
        if(qty!=undefined)this.qty=qty;
        if(typeUsers!=undefined)this.typeUsers=typeUsers;
	}
	save(db)
    {
		//console.log(this);
        return db.collection("invoicedCloudPBX").replaceOne(
            {
                serviceProviderId:this.serviceProviderId,
                groupId:this.groupId,
                sku:this.sku,
				skuName:this.skuName,
            },
            this,
            {upsert: true}
        ).catch(err=>{
            console.log(err)
        })
    }
	static getDataInvoiced(skus,addOns,softphone,AutoAttendant) {
        try {
            let data = [];
            for (let i = 0; i < skus.length; i++) {
                let serviceProviderId = skus[i]._id;
                for (let f = 0; f < skus[i].services.length; f++) {
                    let groupId = skus[i].services[f].groupId;
                    let sku = skus[i].services[f].sku;
                    let skuName = skus[i].services[f].skuName;
                    let qty = skus[i].services[f].total;
                    let typeUsers = skus[i].services[f].typeUser
                    data.push({
                        serviceProviderId: serviceProviderId,
                        groupId: groupId,
                        sku: sku,
                        skuName: skuName,
                        qty: qty,
                        typeUsers: typeUsers
                    })
                }
            }
			for (let i = 0; i < addOns.length; i++) 
			{
                let serviceProviderId = addOns[i]._id;
                for (let f = 0; f < addOns[i].services.length; f++) {
                    let groupId = addOns[i].services[f].groupId;
                    let addOn = addOns[i].services[f].sku;
                    let addOnName = addOns[i].services[f].skuName;
                    let qty = addOns[i].services[f].total;
                    let typeUsers = addOns[i].services[f].typeUser
                    data.push({
                        serviceProviderId: serviceProviderId,
                        groupId: groupId,
                        sku: addOn,
                        skuName: addOnName,
                        qty: qty,
                        typeUsers: typeUsers
                    })
                }
            }
			for (let i = 0; i < softphone.length; i++) 
			{
                let serviceProviderId = softphone[i]._id;

                for (let f = 0; f < softphone[i].services.length; f++) {
                    //console.log(softphone[i].services[f])
                    let groupId = softphone[i].services[f].groupId;
                    let softphoneSku = softphone[i].services[f].sku;
                    let softphoneName = softphone[i].services[f].skuName;
                    let qty = softphone[i].services[f].total;
                    let typeUsers = softphone[i].services[f].typeUser;
                    data.push({
                        serviceProviderId: serviceProviderId,
                        groupId: groupId,
                        sku: softphoneSku,
                        skuName: softphoneName,
                        qty: qty,
                        typeUsers: typeUsers
                    })
                }
            }

			for (let i = 0; i < AutoAttendant.length; i++) 
			{
                let serviceProviderId = AutoAttendant[i]._id;
                for (let f = 0; f < AutoAttendant[i].services.length; f++) {
                    let groupId = AutoAttendant[i].services[f].groupId;
                    let sku = AutoAttendant[i].services[f].sku;
                    let skuName = AutoAttendant[i].services[f].skuName;
                    let qty = AutoAttendant[i].services[f].total;
                    let typeUsers = AutoAttendant[i].services[f].typeUser;
                    data.push({
                        serviceProviderId: serviceProviderId,
                        groupId: groupId,
                        sku: sku,
                        skuName: skuName,
                        qty: qty,
                        typeUsers: typeUsers
                    })
                }
            }
            return data;
        } catch (e) {
            console.log(e);
        }
	}
}
module.exports = cloudPBX;