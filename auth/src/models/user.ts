import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that tells typescript
// the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Dodument has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// A mongoose Middleware function execute before save
userSchema.pre("save", async function (done) {
  // this keyword points to the user object
  if (this.isModified("password")) {
    // only hash the password if it was newly set or just been modified
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// Add a build function into userSchema properties for implementing type check
// the statics property in Mongoose is used to define custom static methods on a model
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
