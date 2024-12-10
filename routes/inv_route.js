const express = require('express');
const router = express.Router();
const invController = require('../controllers/inv_controller');
const invValidate = require('../utilities/inv_validation');
const utilities = require('../utilities/');

// Building the inventory by classification view
router.get('/type/:classification_id', invController.buildByClassificationId);
router.get('/detail/:inv_id', invController.buildByInvId);

//Protected routes
router.get('/', utilities.checkLogin, utilities.checkAuth, invController.buildNewInv);
router.get('/type', utilities.checkLogin, utilities.checkAuth, invController.buildClassification);
router.get('/detail', utilities.checkLogin, utilities.checkAuth, invController.buildInventory);
router.get('/get-inv/:classification_id', utilities.checkLogin, utilities.checkAuth, invController.getInventoryJSON);
router.get('/edit-inv/:inv_id', utilities.checkLogin, utilities.checkAuth, invController.buildEditByInvId);
router.get('/delete-inv/:inv_id', utilities.checkLogin, utilities.checkAuth, invController.buildDeleteInv);


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
