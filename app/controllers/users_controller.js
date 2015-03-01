var mongoose = require('mongoose');
var User = mongoose.model('User');
var Award = mongoose.model('Award');

exports.index = function(req, res) {
  return User.all(function(err, users) {
    if (err) res.send(err);
    return res.json(users);
  });
};

exports.create = function(req, res) {
  return User.create(req.body, function(err) {
    if (err) res.send(err);
    return res.json({ status: 'ok' });
  });
};

exports.show = function(req, res) {
  User.findById(req.params.id).exec(function(err, user) {
    if (err) res.send(err);
    if (!user) { return next(new Error('No user found')); }
    return res.json(user);
  });
};

exports.update = function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    if (err) res.send(err);
    if (!user) { return next(new Error('No user found')); }
    return res.json({ status: 'ok' });
  });
};

exports.destroy = function(req, res) {
  User.findOneAndRemove(req.params.id, function(err, user) {
    if (err) res.send(err);
    if (!user) { return next(new Error('No user found')); }
    return res.json({ status: 'ok' });
  });
};

//badge_id, tag
exports.give = function(req, res) {
  Award.create({from: req.user.id, to: req.params.to, tag: req.body.tag, comment: req.body.comment}, function(err) {
      if (err) res.send(err);
      //add badges and tags to user
      User.findById(req.params.to).exec(function(err, reciver) {
        if (err) res.send(err);
        if (!reciver) { return next(new Error('No user found')); }
        var t;
        for (tg of reciver.tags)
          if (tg.name == req.body.tag) {t = tg; break;}
        if (t) t.count++;
        else reciver.tags.push({name:req.body.tag, count:1});
        reciver.save();
        
        reciver.badges_got.addToSet(req.body.badge_id);
        reciver.badges;
        //TODO: remove 1 from giver pull, add tag to badge
        return res.json({ status: 'ok' });  
      });
    });
};