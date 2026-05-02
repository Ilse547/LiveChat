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
router.get('/groups', VerifyToken, async (req, res) => {
  try {
    const groups = await GroupModel.find({
      Participants: req.user.username
    });
    res.status(200).json({ groups });
  } catch(err) {
    console.error('problem while fetching groups ', err);
    res.status(400).json({ message: 'problem while fethcing groups'});
  }
});


//group infos
router.get('/groupinfo/:groupname', VerifyToken, async (req, res) => {
  try {
    const group = await GroupModel.findOne({ GroupName: req.params.groupname });
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    if (!group.Participants.includes(req.user.username)) {
      return res.status(402).json({ message: 'Your are not part of this group' });
    }
    res.status(200).json({ group });
  } catch(err) {
    console.error('Problem etting group info', err);
    res.status(500).json({ message: 'Error getting group info'});
  }
});

module.exports = router;