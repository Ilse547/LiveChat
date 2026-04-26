//Group routes

const express = require(express);
const router = express.Router();
const GroupModel = require('../models/group');
const { VerifyToken } = require ('../middleware/verifytoken');

//Create group
router.post('/creategroup', VerifyToken, async (req, res) =>{
  const { GroupName, Participants } = req.body;
  if (!GroupName) { return res.status(400).json({message: "No gorup name was given"}); }

  if (!Participants || Participants.length===0) { return res.status(400).json({message:" Group must have at least 2 members"}); }

  try {
    const ExistingGroup = await GroupModel.findOne({ GroupName });
    if (ExistingGroup) { return res.status(400).json({ message : "the chosen name already exists" }); }
    const newGroup = new GroupModel({ 
      GroupName,
      Participants: [...Participants, req.user.username]
    });
    await newGroup.save();
    res.status(201).json({ message: "Group was successfully created" });
  } catch(err){
    console.error('there was an error while creating the group', err);
    res.status(500).json({ message: "There was a problem creating the group"});
  };

});

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
    res.status(500).json({ message: 'Error getting group info', err});
  }
});

module.exports = router;