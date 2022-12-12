const {selectTopics} = require('../models/model.js')

exports.getTopics = (req, res) => {
    selectTopics().then((topics)=>{
        console.log(topics, '<<< in the controller')
        res.status(200).send({topics})
    })
}

