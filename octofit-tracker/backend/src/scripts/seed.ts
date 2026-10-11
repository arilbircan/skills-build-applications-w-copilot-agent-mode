import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    // Seed the octofit_db database with test data
    const userData = [
      { username: 'alexrivera', email: 'alex.rivera@example.com', displayName: 'Alex Rivera' },
      { username: 'jamiechen', email: 'jamie.chen@example.com', displayName: 'Jamie Chen' },
      { username: 'morganpatel', email: 'morgan.patel@example.com', displayName: 'Morgan Patel' },
      { username: 'taylorbrooks', email: 'taylor.brooks@example.com', displayName: 'Taylor Brooks' },
    ];
    const users = await Promise.all(
      userData.map((user) =>
        User.findOneAndUpdate(
          { username: user.username },
          { $set: user },
          { new: true, upsert: true, runValidators: true },
        ).exec(),
      ),
    );
    const usersByUsername = new Map(users.map((user) => [user.username, user]));
    const userId = (username: string) => {
      const user = usersByUsername.get(username);
      if (!user) {
        throw new Error(`Seed user "${username}" was not created`);
      }
      return user._id;
    };

    const teamData = [
      {
        name: 'Trailblazers',
        description: 'Outdoor runners building consistency one mile at a time.',
        members: ['alexrivera', 'jamiechen'],
      },
      {
        name: 'Strength Squad',
        description: 'A supportive team focused on strength and recovery.',
        members: ['morganpatel', 'taylorbrooks'],
      },
    ];
    await Promise.all(
      teamData.map((team) =>
        Team.findOneAndUpdate(
          { name: team.name },
          {
            $set: {
              name: team.name,
              description: team.description,
              members: team.members.map(userId),
            },
          },
          { new: true, upsert: true, runValidators: true },
        ).exec(),
      ),
    );

    const activityData = [
      { id: '650000000000000000000001', username: 'alexrivera', type: 'Run', durationMinutes: 35, caloriesBurned: 320, date: '2026-10-06' },
      { id: '650000000000000000000002', username: 'alexrivera', type: 'Cycling', durationMinutes: 45, caloriesBurned: 410, date: '2026-10-08' },
      { id: '650000000000000000000003', username: 'jamiechen', type: 'Run', durationMinutes: 28, caloriesBurned: 255, date: '2026-10-07' },
      { id: '650000000000000000000004', username: 'jamiechen', type: 'Yoga', durationMinutes: 40, caloriesBurned: 150, date: '2026-10-09' },
      { id: '650000000000000000000005', username: 'morganpatel', type: 'Strength training', durationMinutes: 50, caloriesBurned: 360, date: '2026-10-06' },
      { id: '650000000000000000000006', username: 'morganpatel', type: 'Walk', durationMinutes: 30, caloriesBurned: 130, date: '2026-10-10' },
      { id: '650000000000000000000007', username: 'taylorbrooks', type: 'Strength training', durationMinutes: 42, caloriesBurned: 305, date: '2026-10-08' },
      { id: '650000000000000000000008', username: 'taylorbrooks', type: 'Run', durationMinutes: 25, caloriesBurned: 230, date: '2026-10-10' },
    ];
    await Promise.all(
      activityData.map(({ id, username, date, ...activity }) =>
        Activity.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(id) },
          {
            $set: {
              ...activity,
              user: userId(username),
              date: new Date(`${date}T12:00:00.000Z`),
            },
          },
          { new: true, upsert: true, runValidators: true },
        ).exec(),
      ),
    );

    const leaderboardData = [
      { username: 'alexrivera', points: 1240, rank: 1 },
      { username: 'jamiechen', points: 1085, rank: 2 },
      { username: 'morganpatel', points: 970, rank: 3 },
      { username: 'taylorbrooks', points: 845, rank: 4 },
    ];
    await Promise.all(
      leaderboardData.map(({ username, ...entry }) =>
        Leaderboard.findOneAndUpdate(
          { user: userId(username) },
          { $set: { ...entry, user: userId(username) } },
          { new: true, upsert: true, runValidators: true },
        ).exec(),
      ),
    );

    const workoutData = [
      {
        name: 'Easy 5K Builder',
        description: 'A steady aerobic run with a gentle warm-up and cool-down.',
        difficulty: 'beginner',
        durationMinutes: 30,
        exercises: ['5-minute brisk walk', '20-minute easy run', '5-minute cool-down walk'],
      },
      {
        name: 'Full-Body Strength',
        description: 'A balanced strength circuit using bodyweight movements.',
        difficulty: 'intermediate',
        durationMinutes: 40,
        exercises: ['Squats', 'Push-ups', 'Reverse lunges', 'Plank'],
      },
      {
        name: 'Mobility and Recovery',
        description: 'A low-impact session to improve mobility and support recovery.',
        difficulty: 'beginner',
        durationMinutes: 25,
        exercises: ['Cat-cow stretch', 'Hip flexor stretch', 'Thoracic rotations', 'Hamstring stretch'],
      },
      {
        name: 'Tempo Ride',
        description: 'A cycling workout alternating steady effort with recovery periods.',
        difficulty: 'intermediate',
        durationMinutes: 45,
        exercises: ['10-minute easy spin', '3 x 7-minute tempo intervals', '5-minute cool-down'],
      },
      {
        name: 'Core and Conditioning',
        description: 'A challenging core-focused circuit with short cardio bursts.',
        difficulty: 'advanced',
        durationMinutes: 35,
        exercises: ['Mountain climbers', 'Dead bugs', 'Side planks', 'Burpees'],
      },
    ];
    await Promise.all(
      workoutData.map((workout) =>
        Workout.findOneAndUpdate(
          { name: workout.name },
          { $set: workout },
          { new: true, upsert: true, runValidators: true },
        ).exec(),
      ),
    );

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
