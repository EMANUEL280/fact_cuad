class classification
{
    static getClassification(users,skus)
    {
        try
        {
            
            let test = [];
            let outOfProduct=[];
            for(let i=0;i<users.length;i++)
            {
                
                let service = users[i];
                if(service=="Calling Number Delivery")
                {
                    test.push("Cloud PBX-Basic PBX User")   
                }
                else
                {
                   let validation ="";
                   validation=this.searchServiceUVS(service,skus)
                   if(validation==undefined)
                   {
                       validation=this.getsearchService(service,skus);
                       if(validation==undefined)
                       {
                        outOfProduct.push(service);
                       }
                       else{
                           test.push(validation);
                       }
                   }
                   else{
                       test.push(validation);
                   }
                }
            }
            return{skus:test,outOfProduct:outOfProduct};
        }catch(e)
        {
            console.log(e);
        }
    }
    static searchServiceUVS(service,skus)
    {
        try{
            for(let i =0; i<skus.length;i++)
            {
                let validation=false;
                if(skus[i].userValidationServices)
                {
                    validation=this.getComparationPremiun(service,skus[i].userValidationServices)
                    if(validation)
                    {
                        return skus[i].name;
                    }
                }
            }
        }catch(e){
            console.log(e);
        }
    }
    static getsearchService(service,skus)
    {
        try{
            for(let i =0; i<skus.length;i++)
            {
                let validation=false;
                if((skus[i].userServices&&skus[i]._id!=="TRCLE")||(skus[i].userServices&&skus[i]._id!=="TRCLB"))
                {
                    validation=this.getComparationPremiun(service,skus[i].userServices)
                    if(validation)
                    {
                        return skus[i].name;
                    }
                }
            }
        }catch(e){
            console.log(e)
        }
    }
    static getComparationPremiun(service,array){
        try{
            for(let i=0; i<array.length;i++)
            {
                if(array[i]==service)
                {
                    return true;
                }
            }
        }catch(e){
            console.log(e);
        }
    }
    static getLicences(array,skus)
    {
        try 
        {
            let sku =[];
            let addOns=[];
            let softPhone=[];
            for(let i =0; i<array.length;i++)
            {
                let serviceName= array[i];
                for(let f =0; f<skus.length;f++)
                {
                    if(serviceName===skus[f].name)
                    {
                        if(skus[f].type==="Add-On Product")
                        {
                            addOns.push(skus[f]._id)
                        }
                        else if(skus[f].type==="Extension")
                        {
                            
                            sku.push(skus[f]._id);
                        }
                        else if(skus[f].type==="SoftPhone")
                        {
                            softPhone.push(skus[f]._id)
                        }
                    }
                }
            }
            return{skus:sku,addOns:addOns,softPhone:softPhone}
        } catch (e) 
        {
            console.log(e);           
        }
    }
    static  eliminateDup(array)
    {
        try
        {
            let temporal = [];
            if(array.length>1)
            {
                for(let i =0; i< array.length;i++)
                {
                    let find=true;
                    if(temporal.length==0)
                    {
                        temporal.push(array[i]);
                    }
                    else
                    {
                        let bandera = 0;
                        while(bandera < temporal.length)
                        {
                            if(array[i]==temporal[bandera])
                            {
                                find=false;
                            } 
                            bandera++;
                        }
                        if(find==true)
                        {
                            temporal.push(array[i]);
                        }
                    }
                }
            }
            else{
                temporal=array;
            } 
            return temporal;
        }catch(e){
            console.log(e)
        }
    }
    static getHierarchySku(array)
    {
        try{
            if(array.includes("TRCLE"))
            {
                for(let i =0;i<array.length;i++)
                {
                    if(array[i]=="TRCLB")
                    {
                        array.splice(i,1);
                    }
                }
            }
        }catch(e){
            console.log(e);
        }
    }
    static getSkuName(array,skus)
    {
        try
        {
            let find=false;
            for(let f in array)
            {
                if(array[f]=="TRCLB"||array[f]=="TRCLE")
                {
                    
                    for(let i in skus)
                    {
                        if(array[f]===skus[i]._id)
                        {
                            find=true;
                            return skus[i].name;
                        }
                        
                    }
                }
            }
            if(find==false)
            {
                return "unknownSku"
            }
        }catch(e){
            console.log(e);
        }
    }
    static getExtraName(array,skus)
    {
        try{
            let skuName=[];
            for(let i in array)
            {
                for(let f in skus)
                {
                    if(array[i]==skus[f]._id)
                    {
                        let data = {
                            sku:`${array[i]}`,
                            name:`${skus[f].name}`
                        }
                        skuName.push(data);
                    }
                }
            }
            return skuName;
        }catch(e){
            console.log(e);
        }
    }
}
module.exports= classification;