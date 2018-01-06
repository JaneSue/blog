exports = module.exports = function(app, mongoose){
	var userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    roles: [{ type: String, required: true }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  });
  userSchema.index({ username: 1 }, { unique: true });
  app.db.model('User', userSchema);
}
