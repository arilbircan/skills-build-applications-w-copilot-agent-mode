import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    displayName: { type: String, trim: true },
    passwordHash: { type: String, select: false },
  },
  { timestamps: true },
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    caloriesBurned: { type: Number, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, min: 0, default: 0 },
    rank: { type: Number, min: 1 },
  },
  { timestamps: true },
);

const workoutSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    durationMinutes: { type: Number, min: 0 },
    exercises: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const User = model('User', userSchema, 'users');
export const Team = model('Team', teamSchema, 'teams');
export const Activity = model('Activity', activitySchema, 'activities');
export const Leaderboard = model('Leaderboard', leaderboardSchema, 'leaderboard');
export const Workout = model('Workout', workoutSchema, 'workouts');
