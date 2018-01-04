exports = module.exports = function(app, mongoose){
	var userSchema = new mongoose.Schema({
		phone: { type: String, unique: true, max: 20 },
    username: { type: String, unique: true },
    password: String,
    roles: {
      admin: { type: mongoose.Schema.Types.ObjectId },
      server: { type: mongoose.Schema.Types.ObjectId }
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  });
  userSchema.index({ phone: 1 }, { unique: true });
  app.db.model('User', userSchema);
}