const express = require('express');
const router = express.Router();
const invController = require('../controllers/inv_controller');
const invValidate = require('../utilities/inv_validation');

// Building the inventory by classification view
router.get('/', invController.buildNewInv);
router.get('/type/:classification_id', invController.buildByClassificationId);
router.get('/detail/:inv_id', invController.buildByInvId);
router.get('/type', invController.buildClassification);
router.get('/detail', invController.buildInventory);
router.get('/get-inv/:classification_id', invController.getInventoryJSON)
router.get('/edit-inv/:inv_id', invController.buildEditByInvId)
router.get('/delete-inv/:inv_id', invController.buildDeleteInv)


router.post('/type',
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addClassification);

router.post('/detail',
    invValidate.detailRules(),
    invValidate.checkDetailData,
    invController.addDetail);

router.post('/edit-inv',
    invValidate.detailRules(),
    invValidate.checkEditInvById,
    invController.editInvById);

router.post('/delete-inv', invController.deleteInvById)



module.exports = router;
