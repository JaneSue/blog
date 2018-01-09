exports = module.exports = function(app, mongoose){
  var articleSchema = new mongoose.Schema({
    title: String,
    content: String,
    cover: String
    sort_by: { type: Number, required: true },
    status: Number,
    category_by: { type: mongoose.Schema.Types.ObjectId },
    create_by: { type: mongoose.Schema.Types.ObjectId },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  });
  userSchema.index({ create_by: 1 }, { unique: true });
  app.db.model('Article', articleSchema);
}