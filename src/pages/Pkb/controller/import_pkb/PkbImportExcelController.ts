import { ModelListExcel } from "../../model/ModelListExcel";
import e, { Request, Response } from "express";
import ResponseResult from "../../../../core/response/ResponseResult";
import { EnumResponseCode } from "../../../../utils/enum/EnumResponseCode";
import CustomerRepository from "../../../../domain/repository/CustomerRepository/CustomerRepository";
import Token from "../../../../utils/Token";
import ModelUsers from "../../../../db/models/ModelUsers";
import { ModelResultImportPkb } from "../../model/ModelResultImportPkb";
import { EnumErrorImportPKB } from "../../utils/enum/EnumErrorImportPKB";
import { ResponseImportPkb } from "../../utils/ResponseImportPkb/ResponseImportPkb";
import CustomerPkb from "./CustomerPkb";
import { ModelDetailCustomer } from "../../../../domain/models/Customer/ModelDetailCustomer";
import FinalInspectorPkb from "./FinalInspectorPkb";
import KendaraanPkb from "./KendaraanPkb";
import PitPkb from "./PitPkb";
import ServiceAdvisor from "./ServiceAdvisor";
import { ListOfPIT } from "../../../../domain/models/Pit/ModelPit";
import { ListOfKaryawanModel } from "../../../../domain/models/Mekanik/ModelMekanik";
import { ListofKendaraan } from "../../../../domain/models/Kendaraan/ModelGetListKendaraan";
import { InterfaceStorePkb } from "../../../../domain/repository/PkbRepository/interface/InterfaceStorePkb";
import PkbRepository from "../../../../domain/repository/PkbRepository/PkbRepository";
import { ListDropDown, ModelListMekanikPKB } from "../../../../domain/models/DropDown/ModelListMekanikPKB";
import FormatDate from "../../../../utils/Format/FormatDate/FormatDate";
import JasaPkb from "./JasaPkb";
import { ConvertModelResultJasaPkb, ListofJasa, ModelResultJasaPkb } from "../../model/ModelResultJasaPkb";
import { ModelResultDataJasaPkb } from "../../model/ModelResultDataJasaPkb";
import { InterfaceAddDataServices } from "../../model/ModelAddExcelPkb";


class PkbImportExcelController {


    public importExcel = async ( req : Request, res : Response ) => {
        const data : ModelListExcel [] = req.body;

        try {

            let dataSend : InterfaceAddDataServices[] = [];


            for ( const item of data ) {
                const respUser = await ModelUsers.findOne( {
                    where : {
                        username : item.username
                    }
                } )

                if ( !respUser ) {
                    return ResponseResult.error( res, {
                        statusCode : EnumResponseCode.BAD_REQUEST,
                        errorCode : "01",
                        message : "User tidak Ditemukan",
                        data : null
                    } )
                }

                const checkToken = await Token.getTokenNew( req, res, Number( respUser?.id?.toString() ) ?? Number( 0 ) );

                if ( checkToken ) {

                    const checkCustomer : ModelResultImportPkb = await CustomerPkb.checkCustomer( {
                        data : item,
                        token : checkToken,
                        res : res,
                    } )

                    const customer : ModelDetailCustomer = checkCustomer.data as ModelDetailCustomer;

                    const checkKendaraanPkb = await KendaraanPkb.checkKendaraan( {
                        data : item,
                        token : checkToken,
                        res : res,
                    } )

                    const kendaraanPkb : ListofKendaraan = checkKendaraanPkb.data as ListofKendaraan;

                    if ( checkKendaraanPkb.message === EnumErrorImportPKB.error ) {
                        return ResponseResult.error( res, {
                            statusCode : EnumResponseCode.BAD_REQUEST,
                            errorCode : "01",
                            message : checkKendaraanPkb.error,
                            data : null
                        } )
                    }

                    const checkPitPkb = await PitPkb.checkPit( {
                        data : item,
                        token : checkToken,
                        res : res,
                    } )

                    const pitPkb : ListOfPIT = checkPitPkb.data as ListOfPIT;

                    if ( checkPitPkb.message === EnumErrorImportPKB.error ) {
                        return ResponseResult.error( res, {
                            statusCode : EnumResponseCode.BAD_REQUEST,
                            errorCode : "01",
                            message : checkPitPkb.error,
                            data : null
                        } )

                    }

                    const checkServiceAdvisor = await ServiceAdvisor.checkServiceAdvisor( {
                        data : item,
                        token : checkToken,
                        res : res,
                    } )

                    const serviceAdvisor : ListDropDown = checkServiceAdvisor.data as ListDropDown;

                    if ( checkServiceAdvisor.message === EnumErrorImportPKB.error ) {
                        return ResponseResult.error( res, {
                            statusCode : EnumResponseCode.BAD_REQUEST,
                            errorCode : "01",
                            message : checkServiceAdvisor.error,
                            data : null
                        } )

                    }

                    const checkFinalInspector = await FinalInspectorPkb.checkFinalInspector( {
                        data : item,
                        token : checkToken,
                        res : res,
                    } )
                    // ModelListMekanikPKB.listDropDown
                    const finalInspector : ListDropDown = checkFinalInspector.data as ListDropDown;

                    if ( checkFinalInspector.message === EnumErrorImportPKB.error ) {
                        return ResponseResult.error( res, {
                            statusCode : EnumResponseCode.BAD_REQUEST,
                            errorCode : "01",
                            message : checkFinalInspector.error,
                            data : null
                        } )
                    }

                    const checkJasa = await JasaPkb.checkJasaPkb( {
                        data : item,
                        token : checkToken,
                        res : res,
                    } )

                    const jasaPkb : ModelResultDataJasaPkb = checkJasa.data as ModelResultDataJasaPkb;

                    // return ResponseResult.successGet( res, jasaPkb )

                    // 2022-12-31T02:00:00+07:00

                    // return ResponseResult.successGet( res, {
                    //     data :
                    // } )


                    let dataStore : InterfaceAddDataServices = {
                        token : checkToken,
                        action : 0,
                        idPKB : 0,
                        // tanggalSampai : FormatDate.dateSend( item.tanggal ),
                        activityCapacity : 0,
                        alamatPembawa : item.alamat_ktp_pembawa,
                        alamatPembawaSaatIni : item.alamat_ktp_pembawa,
                        alasanIngatServiceID : 4,
                        DataMotorkuX : {
                            VoucherType : 0,
                            VoucherValue : 0,
                        },
                        dealerSendiri : true,
                        handphonePembawa : item.handphone_pembawa,
                        hubunganDgPemilikID : 7,
                        kmBerikutnya : item.kilometer_berikutnya,
                        kmSekarang : item.kilometer_sekarang,
                        namaPembawa : item.nama_pembawa,
                        noAntrian : "",
                        // noPolisi : kendaraanPkb.noPolisi,
                        finalInspectorID : finalInspector.nilai,
                        gejala : item.gejala_analisa_service_advisor,
                        kotaPembawa : item.kota_pembawa,
                        idGudang : 0,
                        idPit : pitPkb.id,
                        indikatorBensin : 0,
                        isEngineNo : false,
                        isFrameNo : false,
                        // isFirstLoad : 0,
                        isPKBHotline : false,
                        jamEstimasiSelesai : "",
                        jamKedatanganCustomer : FormatDate.dateSend( item.jam_kedatangan_customer ),
                        jamSelesai : "",
                        kecamatanPembawa : item.kecamatan_pembawa,
                        keluhan : item.keluhan,
                        kodeAntrian : "",
                        listOfMaterialHotline : [],
                        // listOfMaterialPKB: ,
                        listOfPekerjaan : [
                            {
                                guid : '',
                                pkbID : 0,
                                pkbPekerjaanID : 0,
                                itemNo : 0,
                                refJobID : jasaPkb.id ?? 0,
                                nilaiDiskon : jasaPkb.nilaiDiskon,
                                nilaiDiskonJasa : jasaPkb.nilaiDiskon,
                                persentaseDiskon : jasaPkb.persentaseDiskon,
                                persentaseDiskonJasa : jasaPkb.persentaseDiskon,
                                totalJasa : jasaPkb.nilaiDiskon + jasaPkb.persentaseDiskon + jasaPkb.pajakJual + jasaPkb.hargaJual,
                                pajakJasa : jasaPkb.pajakJual,
                                hargaPekerjaan : jasaPkb.hargaJual,
                                namaPekerjaan : jasaPkb.namaJasa,
                                isOPL : false,
                                labelisOPL : 'Tidak',
                                listOfMaterial : [],
                                // listSparepartTable.map( ( valueData ) : InterfaceListSparePartPKB => {
                                //     if ( valueData.pekerjaanID === item.idJasa ) {
                                //         return valueData
                                //     }
                                //     return {} as InterfaceListSparePartPKB
                                // } ),
                                listOfMaterialHotline : [],
                                kodeJasa : jasaPkb.kodeJasa,
                                idJasa : jasaPkb.id,
                                isShowDelete : true,
                                isEditable : true,
                                isFreeService : jasaPkb.isFreeService,
                                flatRate : 0,
                                markUpJasa : 0,
                                vendorID : 0,
                                noClaimC2 : '',
                                noBuku : '',
                                isAdditionalPekerjaan : 0, //ubah
                            }
                        ],
                        noBuku : "",
                        noClaimC2 : "",
                        noSTNK : item.no_stnk,
                        // pageNumber : 0,
                        // pageSize : 0,
                        partBekasDibawaKonsumen : false,
                        pergantianPart : false,
                        pkbRemove : {
                            listRemoveMaterial : [],
                            listRemovePekerjaan : [],
                        },
                        refEquipmentID : kendaraanPkb.id,
                        refMechanicID : "",
                        serviceAdvisorID : serviceAdvisor.nilai.toString(),
                        statusPKB : 0,
                        tipePKB : 1,
                        // sortColumn : "",
                        // sortDirection : 0,
                        tanggal : FormatDate.dateSend( item.tanggal ),
                        // statusPencarianPKB : 0,
                        svPKBReturnID : 0,
                        tipeAntrian : item.tipe_antrian,
                        tipeComingCustomer : "Milik", //wajib
                        // totalRow : 0,
                        uangMuka : 0,
                        jamMasuk : "",
                        jamProses : "",
                        latitude : 0,
                        longitude : 0,
                        pkbNo : "",

                    }

                    // return ResponseResult.successGet( res, dataStore )

                    dataSend.push( dataStore );
                }
                else {
                    return ResponseResult.error( res, {
                        statusCode : EnumResponseCode.UNAUTHORIZED,
                        errorCode : '01',
                        message : 'Credential Login Tidak Valid',
                        data : null,
                    } )
                }


            }

            let statusSend : string[] = []

            if ( dataSend.length > 0 ) {

                for ( const item of dataSend ) {
                    await PkbRepository.storeDataExcel( res, item.token ?? '', item )
                                       .then( ( result ) => {
                                           if ( result?.ack !== 1 ) {
                                               statusSend.push( result?.message ?? '' )
                                           }
                                       } )
                }

                return ResponseResult.successGet( res, {
                    statusSend : statusSend,
                    data : dataSend,
                } )
                // statusSend.length >
                // 0 ? JSON.stringify( statusSend ) :
                //     'Success Import Excel'


            }
            else {
                return ResponseResult.error( res, {
                    statusCode : EnumResponseCode.BAD_REQUEST,
                    errorCode : '01',
                    message : 'Data Tidak Valid, Silahkan Cek Kembali Data Anda',
                    data : null,
                } )

            }

        } catch ( e : any ) {
            return ResponseResult.error( res, {
                errorCode : '01',
                statusCode : EnumResponseCode.FORBIDDEN,
                message : e,
                data : null,
            } );
        }
    }


}

export default new PkbImportExcelController();
