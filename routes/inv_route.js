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

router.post('/type',
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addClassification);

router.post('/detail',
    invValidate.detailRules(),
    invValidate.checkDetailData,
    invController.addDetail);



module.exports = router;
