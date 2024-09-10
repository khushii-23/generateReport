const express = require('express')
const{createReport, getAllReport, getReportById, deleteReportById, updateReportById}=require('../controllers/reportControllers')

const router=express.Router()

router.post('/createReport',createReport)
router.get('/getAllReport',getAllReport)
router.get('/getReportById/:id',getReportById)
router.delete('/deleteReportById/:id', deleteReportById)
router.patch('/updateReportById/:id',updateReportById)

module.exports=router;