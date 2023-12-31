import { Response } from "express";
import { post } from "../../../core/api/api";
import { InterfaceGetPitMekanik } from "./interface/InterfaceGetPitMekanik";
import { ModelPitMekanik,ConvertGetPitMekanik } from "../../models/PitMekanik/ModelPitMekanik";
import { InterfaceStorePitMekanik } from "./interface/InterfaceStorePitMekanik";

class PitMekanikRepository {
    public getData = async(res: Response, token: string, reqBody: InterfaceGetPitMekanik): Promise<ModelPitMekanik | null> => {
        const resp = await post(res, {
            url: '/api/Master/GETPITMekanik',
            token: token,
            reqBody: reqBody
        })
        if(resp !== null){
            return ConvertGetPitMekanik.toGetListPitMekanik(resp);
        }
        return null;
    }

    public storeData = async(res: Response, token: string, reqBody: InterfaceStorePitMekanik): Promise<ModelPitMekanik | null> => {
        const resp = await post(res, {
            url: '/api/Master/PUTPITMekanik',
            token: token,
            reqBody: reqBody
        })
        if(resp !== null){
            return ConvertGetPitMekanik.toGetListPitMekanik(resp);
        }
        return null;
    }

    public detailData = async(res: Response, token: string, reqBody: InterfaceStorePitMekanik): Promise<ModelPitMekanik | null> => {
        const resp = await post(res, {
            url: '/api/Master/GETPITMekanik',
            token: token,
            reqBody: reqBody
        })
        if(resp !== null){
            return ConvertGetPitMekanik.toGetListPitMekanik(resp);
        }
        return null;
    }
}

export default new PitMekanikRepository()