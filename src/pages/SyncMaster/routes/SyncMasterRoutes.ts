import BaseRoutes from "../../../core/routes/BaseRoutes";
import { authAdmin } from "../../../middleware/AdminMiddleware";
import SyncMasterController from "../controller/SyncMasterController";
import { validateGroupSyncMaster, validateSyncMaster } from "../validator/validatorSyncMaster";


class SyncMasterRoutes extends BaseRoutes {
    routes() : void {
        this.router.post( '/drop-down', validateSyncMaster, authAdmin, SyncMasterController.dropDown );
        this.router.post( '/group-drop-down', validateGroupSyncMaster, authAdmin, SyncMasterController.groupDropDown );
    }
}

export default new SyncMasterRoutes().router;
