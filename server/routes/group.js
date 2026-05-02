const express = require('express');
const router = express.Router();
const GroupModel = require('../models/group');
const { VerifyToken } = require('../middleware/verifytoken');
const { ResponseError } = require('../middleware/responseerror');
const { AsyncHandler } = require('../middleware/async')

  router.post('/creategroup', VerifyToken, AsyncHandler(async (req, res) =>{
    const { GroupName, Participants } = req.body;
    if (!GroupName) throw new ResponseError('Group needs a name', 401, 'group.name.missing');

    if (!Participants || Participants.length===0) throw new ResponseError('Group must have at least 2 members', 401, 'group.not.enough.participants');

    const ExistingGroup = await GroupModel.findOne({ GroupName });
    if (ExistingGroup) throw new ResponseError('Group name already taken', 400, 'group.name.already.taken');

    const newGroup = new GroupModel({ 
      GroupName,
      Participants: [...Participants, req.user.username]
    });

    await newGroup.save();
    res.status(201).json({ message: "Group was successfully created" });

}));

// fetch groups
router.get('/groups', VerifyToken, AsyncHandler(async (req, res) => {
  const groups = await GroupModel.find({
    Participants: req.user.username
  });
  res.status(200).json({ groups });
}));


//group infos
router.get('/groupinfo/:groupname', VerifyToken, AsyncHandler(async (req, res) => {
    const group = await GroupModel.findOne({ GroupName: req.params.groupname });
    if (!group) throw new ResponseError('No groups were found', 404, 'group.not.found');

    if (!group.Participants.includes(req.user.username)) throw new ResponseError('Yoou are not a group participant', 401, 'group.user.not.participant');
    res.status(200).json({ group });
}));

module.exports = router;