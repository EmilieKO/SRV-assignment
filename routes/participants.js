const CyclicDB = require('@cyclic.sh/dynamodb')
const db = CyclicDB(process.env.CYCLIC_DB)
var express = require('express');
var router = express.Router();
let participants = db.collection('participants')
var jsend = require('jsend');
router.use(jsend.middleware)

/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        let list = await participants.list();
        res.jsend.success({ list });
    } catch (error) {
        res.jsend.error({ message: "Failed to retrieve participants list", error: error.message });
    }
});

router.post('/add', async function (req, res, next) {
    const { email, firstName, lastName, dob, active, work, home } = req.body
    const dobRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!dobRegex.test(dob)) {
        return res.jsend.fail({ message: "DOB must be in YYYY/MM/DD format" })
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
        return res.jsend.fail({ message: "Invalid email format" });
    }
    await participants.set(email, {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        active: Number(active),
        work: {
            companyName: work.companyName,
            salary: work.salary,
            currency: work.currency
        },
        home: {
            country: home.country,
            city: home.city
        }
    })
    res.jsend.success({ "result": "You have logged a participant." });
})

router.get('/details', async function (req, res, next) {
    try {
        let keysData = await participants.list();
        let keys = keysData.results.map(item => item.key);
        let allParticipants = [];

        for (const key of keys) {
                let details = await participants.get(key);
                if (details.props.active == 1) {
                    let participantDetails = {
                        email: details.props.email,
                        firstName: details.props.firstName,
                        lastName: details.props.lastName,
                        created: details.props.created,
                        active: details.props.active,
                        updated: details.props.updated,
                        dob: details.props.dob
                    }
                    allParticipants.push(participantDetails);
                }
        } 
        res.jsend.success({ participants: allParticipants });
    } catch (error) {
        res.jsend.error({ message: "Failed to retrieve participant details", error: error.message });
    }
});


router.get('/details/deleted', async function (req, res, next) {
    try {
        let keysData = await participants.list()
        let keys = keysData.results.map(item => item.key);
        let allParticipants = []

        for (const key of keys) {
            let details = await participants.get(key)
            if (details.props.active == 0) {
                allParticipants.push(details)
            }
        }
        res.jsend.success({ participants: allParticipants })
    } catch (error) {
        res.jsend.error({ message: "Failed to retrieve participant details", error: error.message });
    }
})

router.get('/details/:email', async function (req, res, next) {
    try {
        const email = req.params.email
        const participant = await participants.get(email)
        if (!participant) {
            return res.jsend.fail({ message: "Participant not found" });
        }
        res.jsend.success({ participant })
    } catch (error) {
        res.jsend.error({ message: "Failed to retrieve participant details", error: error.message });
    }
})

router.get('/work/:email', async function (req, res, next) {
    try {
        const email = req.params.email
        const participant = await participants.get(email)
        if (!participant) {
            return res.jsend.fail({ message: "Participant not found" });
        }
        const work = participant.props.work
        res.jsend.success({ work })
    } catch (error) {
        res.jsend.error({ message: "Failed to retrieve participant details", error: error.message });
    }
})

router.get('/home/:email', async function (req, res, next) {
    try {
        const email = req.params.email
        const participant = await participants.get(email)
        const home = participant.props.home
        res.jsend.success({ home })
    } catch (error) {
        res.jsend.error({ message: "Failed to retrieve participant details", error: error.message });
    }
})

router.delete('/:email', async function (req, res, next) {
    try {
        const email = req.params.email;
        const existingParticipant = await participants.get(email);
        if (!existingParticipant) {
            return res.jsend.fail({ message: "Participant not found" });
        }
        await participants.set(email, { ...existingParticipant, active: 0 });
        res.jsend.success({ message: "Participant deleted successfully." });
    } catch (error) {
        res.jsend.error({ message: "Failed to delete participant", error: error.message });
    }
});

router.put('/:email', async function (req, res, next) {
    try {
        const emailParam = req.params.email;
        const { email, firstName, lastName, dob, work, home } = req.body
        
        const existingParticipant = await participants.get(emailParam);
        if (!existingParticipant) {
            return res.jsend.fail({ message: "Participant not found" });
        }
        await participants.set(email, {
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            active: active,
            work: work,
            home: home
        })
        res.end();
    } catch (error) {
        res.jsend.error({ message: "Failed to change participant details", error: error.message });
    }
})

module.exports = router;