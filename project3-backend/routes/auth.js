const express = require("express");
const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        return res.status(200).json({auth: "auth"})
    } catch (err) {
        next(err);
    }
})


router.get("/new", async (req, res, next) => {
    try {
        console.log(req.query);
        const employee = await Auth.addEmployee({
            firstName: req.query?.firstName,
            lastName: req.query?.lastName,
            email: req.query?.email,
            uin: req.query?.uin,
            type: req.query?.type
        });
        return res.status(200).json(employee);
    } catch (err) {
        next(err);
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const userType = await Auth.getClassification(req.params?.id)
        return res.status(200).json(userType)
    } catch (err) {
        next(err);
    }
})

router.put("/edit", async (req, res, next) => {
    try {
        console.log(req.query);
        const employee = await Auth.editEmployee({
            firstName: req.query?.firstName,
            lastName: req.query?.lastName,
            email: req.query?.email,
            uin: req.query?.uin,
            type: req.query?.type
        });
        return res.status(200).json(employee);
    } catch (err) {
        next(err);
    }
})

module.exports = router;