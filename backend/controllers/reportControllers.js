const Report = require('../models/reportSchema')

exports.createReport = async(req,res)=>{
    try{
        let report = new Report(req.body)
        await report.save()
        res.json({
            success:true
        })
    }
    catch(error){
        res.json({
            success:false,
            error:error
        })
    }
}

exports.getAllReport = async (req,res)=>{
    try{
        const report = await Report.find()
        res.json({
            success:true,
            data:report
        })
    }
    catch(error){
        res.json({
            success:false,
            error:error
        })
    }
}

exports.getReportById = async(req,res)=>{
    try{
        const report = await Report.findById(req.params.id)
        res.json({
            success:true,
            data:report
        })
    }
    catch(error){
        res.json({
            success:false,
            error:error
        })
    }
}

exports.deleteReportById = async (req,res)=>{
    try{
        const report = await Report.findByIdAndDelete(req.params.id)
        res.json({
            success:true,
            data:report
        })
    }
    catch(error){
        res.json({
            success:false,
            error:error
        })
    }
}
exports.updateReportById = async(req,res)=>{
    try{
        const report = await Report.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json({
            success:true,
            data:report
        })
    }
    catch(error){
        res.json({
            success:false,
            error:error
        })
    }
}