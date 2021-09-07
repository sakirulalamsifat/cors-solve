import 'dotenv/config'

const getImageFullPath = async(Logo_Image=null)=>{

    if(Logo_Image){

        let logo = Logo_Image
        //Logo_Image=9841245601_Merchant_Logo_Image202012220712295797_2020-12-22.png
        const  split_array = Logo_Image.split('_')
        //split_array = ['9841245601','Merchant','Logo','Image202012220712295797','2020-12-22.png']
        const get_folder_composit_name = split_array[split_array.length-1].split('.')
        //get_folder_composit_name= ['2020-12-22','png']
        const folder_names = get_folder_composit_name[0].split('-')
        //folder_names = ['2020','12','22',.....]
        Logo_Image = process.env.IMAGE_SYSTEM_BASE_URL
        folder_names.forEach((item,index)=>Logo_Image= `${Logo_Image}/${folder_names[index]}`)

        return `${Logo_Image}/${logo}`

    }
    else{

        return null
    }

}


module.exports = {getImageFullPath}