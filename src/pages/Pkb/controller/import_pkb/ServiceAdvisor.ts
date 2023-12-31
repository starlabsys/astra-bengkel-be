import MekanikRepository from "../../../../domain/repository/Mekanik/MekanikRepository"
import { ModelParamPkb } from "../../model/ModelParamPkb"
import { ModelResultImportPkb } from "../../model/ModelResultImportPkb"
import { ResponseImportPkb } from "../../utils/ResponseImportPkb/ResponseImportPkb"
import { EnumErrorImportPKB } from "../../utils/enum/EnumErrorImportPKB"
import MasterDataMekanikRepository from "../../../../domain/repository/MasterData/mekanik/MasterDataMekanikRepository";


class ServiceAdvisor {

    // public storeServiceAdvisor = async ( props : ModelParamPkb ) : Promise<ModelResultImportPkb> => {
    //     try{

    //     }catch(e:any){
    //         return ResponseImportPkb( {
    //             status : EnumErrorImportPKB.error,
    //             error : e
    //         } )
    //     }
    // }
    public checkServiceAdvisor = async ( props : ModelParamPkb ) : Promise<ModelResultImportPkb> => {
        try {
            const getSa = await MasterDataMekanikRepository.getListMekanik( props.res, props.token ?? '', {
                tipe : 23,
                namaMekanik : ""
            } )

            if ( getSa !== null ) {
                if ( getSa.ack === 1 ) {
                    return ResponseImportPkb( {
                        status : EnumErrorImportPKB.success,
                        data : getSa.listDropDown[ 0 ]
                    } )
                }
                else {
                    // return ResponseImportPkb( {
                    //     status : EnumErrorImportPKB.success,
                    //     data : "Tidak"
                    // } )
                    // create service advisor todo
                    // TODO: create service advisor

                    
                }
            }

            return ResponseImportPkb( {
                status : EnumErrorImportPKB.error,
                error : "Error Get Service Advisor"
            } )

        } catch ( e : any ) {
            return ResponseImportPkb( {
                status : EnumErrorImportPKB.error,
                error : e
            } )
        }
    }
}

export default new ServiceAdvisor()
