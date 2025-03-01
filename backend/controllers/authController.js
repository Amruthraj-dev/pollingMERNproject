const User = require("../model/User");
const Poll = require("../model/Poll");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs")

//Generating JWT TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1hr" });
};

//Register User
exports.registerUser = async (req, res) => {
  const { fullName, username, email, password, profileImageUrl } = req.body;

  //Validation: Check for missing fields
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Validation: Check username format
  //Allows alphanumeric characters and hyphens only
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Invalid username. Only alphanumeric characters and hyphens are allowed. No spaces are permitted.",
    });
  }

  try {
    //checking if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Username not available try another one." });
    }

    //creating user
    const user = await User.create({
      fullName,
      username,
      email,
      password,
      profileImageUrl,
    });
    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

//Login User
exports.LoginUser = async (req, res) => {
  const { email, password } = req.body;

  //Validation check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid creditals" });
    }

    //count polls created by the user
    const totalPollsCreated=await Poll.countDocuments({creator:user._id});

    //count polls the user has voted in
    const totalPollsVotes=await Poll.countDocuments({
      voters:user._id
    })

    //Get the count of bookmarked polls
    const totalPollsBookmarked=user.bookmarkedPolls.length

    res.status(200).json({
      id: user._id,
      user: {
        ...user.toObject(),
        totalPollsCreated,
        totalPollsVotes,
        totalPollsBookmarked,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Logining in user", error: err.message });
  }
};

//Get User Info
exports.getUserinfo = async (req, res) => {
  try {
    console.log("Fetching user info for:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

        //count polls created by the user
        const totalPollsCreated=await Poll.countDocuments({creator:user._id});

        //count polls the user has voted in
        const totalPollsVotes=await Poll.countDocuments({
          voters:user._id
        })
    
        //Get the count of bookmarked polls
        const totalPollsBookmarked=user.bookmarkedPolls.length
    
    //Add the new attributes to the response
    const userInfo = {
      ...user.toObject(),
      totalPollsCreated,
      totalPollsVotes,
      totalPollsBookmarked,
    };

    res.status(200).json(userInfo);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user info", error: err.message });
  }
};
